#!/usr/bin/env bash

set -euo pipefail

# Default test file
TEST_FILE="${1:-$(dirname "$0")/api-tests.json}"

if [[ ! -f "$TEST_FILE" ]]; then
    echo "Error: Test file '$TEST_FILE' not found" >&2
    echo "Usage: $0 [test-file.json]" >&2
    exit 1
fi

# Check dependencies
for cmd in curl jq; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
        echo "Error: required command '$cmd' not found. Please install it and re-run." >&2
        exit 1
    fi
done

# Global variables file for captured data
VARS_FILE=$(mktemp)
trap "rm -f $VARS_FILE" EXIT

header() {
    echo
    echo "=================================================="
    echo "$1"
    echo "=================================================="
}

# Function to set captured variable
set_var() {
    local name="$1"
    local value="$2"
    echo "${name}=${value}" >> "$VARS_FILE"
}

# Function to get captured variable
get_var() {
    local name="$1"
    grep "^${name}=" "$VARS_FILE" 2>/dev/null | cut -d'=' -f2- | tail -n1
}

# Function to replace variables in strings
replace_variables() {
    local input="$1"
    local result="$input"
    
    # Replace built-in variables
    result="${result//\{\{timestamp\}\}/$(date +%s)}"
    result="${result//\{\{pid\}\}/$$}"
    result="${result//\{\{random\}\}/${RANDOM}}"
    
    # Replace custom variables
    while IFS='=' read -r var_name var_value; do
        if [[ -n "$var_name" && -n "$var_value" ]]; then
            result="${result//\{\{${var_name}\}\}/${var_value}}"
        fi
    done < "$VARS_FILE"
    
    echo "$result"
}

# Function to get nested JSON value using jq path
get_json_value() {
    local json="$1"
    local path="$2"
    
    # Convert dot notation to jq syntax
    local jq_path
    if [[ "$path" =~ ^[0-9]+$ ]]; then
        # Array index
        jq_path=".[$path]"
    elif [[ "$path" == *"."* ]]; then
        # Nested object path
        jq_path=$(echo ".$path" | sed 's/\./\./g')
    else
        # Simple property
        jq_path=".$path"
    fi
    
    echo "$json" | jq -r "$jq_path" 2>/dev/null || echo "null"
}

# Function to make API calls
api_call() {
    local method="$1"
    local url="$2"
    local body="$3"
    local expect_code="$4"
    local expect_json="$5"
    
    local tmp
    tmp=$(mktemp)
    
    local http_code
    if [[ -n "$body" && "$body" != "null" ]]; then
        http_code=$(curl -sS -o "$tmp" -w "%{http_code}" -X "$method" "$url" \
            -H "Content-Type: application/json" \
            -d "$body")
    else
        http_code=$(curl -sS -o "$tmp" -w "%{http_code}" -X "$method" "$url")
    fi
    
    echo "HTTP ${http_code} ${method} ${url##*/}" >&2
    
    # Display response (to stderr)
    if [[ "$expect_json" == "true" ]]; then
        cat "$tmp" | jq . 2>/dev/null >&2 || {
            echo "Failed to parse JSON response:" >&2
            cat "$tmp" >&2
        }
    else
        cat "$tmp" >&2
    fi
    
    # Check status code
    if [[ "$http_code" != "$expect_code" ]]; then
        echo "❌ Assertion failed: expected HTTP $expect_code, got $http_code" >&2
        cat "$tmp" >&2
        rm -f "$tmp"
        exit 1
    fi
    
    # Return raw response for further processing
    cat "$tmp"
    rm -f "$tmp"
}

# Function to assert JSON values
assert_json() {
    local response="$1"
    local expected_key="$2"
    local expected_value="$3"
    
    # Replace variables in expected value
    expected_value=$(replace_variables "$expected_value")
    
    local actual_value
    actual_value=$(get_json_value "$response" "$expected_key")
    
    # Handle different value types
    if [[ "$expected_value" =~ ^[0-9]+$ ]]; then
        # Numeric comparison
        if [[ "$actual_value" != "$expected_value" ]]; then
            echo "❌ Assertion failed: $expected_key expected '$expected_value', got '$actual_value'" >&2
            return 1
        fi
    elif [[ "$expected_value" == "true" || "$expected_value" == "false" ]]; then
        # Boolean comparison
        if [[ "$actual_value" != "$expected_value" ]]; then
            echo "❌ Assertion failed: $expected_key expected '$expected_value', got '$actual_value'" >&2
            return 1
        fi
    else
        # String comparison
        if [[ "$actual_value" != "$expected_value" ]]; then
            echo "❌ Assertion failed: $expected_key expected '$expected_value', got '$actual_value'" >&2
            return 1
        fi
    fi
    
    echo "✅ Assertion passed: $expected_key = '$expected_value'" >&2
    return 0
}

# Main execution
echo "🚀 Running JSON-driven API tests from: $TEST_FILE"

# Read configuration
BASE_URL=$(jq -r '.config.baseUrl' "$TEST_FILE")
echo "Base URL: $BASE_URL"

# Initialize built-in variables
TIMESTAMP=$(date +%s)
PID=$$
RANDOM_NUM=${RANDOM}

# Process variable definitions
if jq -e '.config.variables' "$TEST_FILE" >/dev/null; then
    while IFS='=' read -r key value; do
        if [[ -n "$key" && -n "$value" ]]; then
            # Replace built-in variables first
            value="${value//\{\{timestamp\}\}/$TIMESTAMP}"
            value="${value//\{\{pid\}\}/$PID}"
            value="${value//\{\{random\}\}/$RANDOM_NUM}"
            
            # Replace variables that have already been defined
            while IFS='=' read -r var_name var_value 2>/dev/null; do
                if [[ -n "$var_name" && -n "$var_value" ]]; then
                    value="${value//\{\{${var_name}\}\}/${var_value}}"
                fi
            done < "$VARS_FILE"
            
            set_var "$key" "$value"
        fi
    done < <(jq -r '.config.variables | to_entries[] | "\(.key)=\(.value)"' "$TEST_FILE")
fi

# Process test groups
test_group_count=$(jq '.tests | length' "$TEST_FILE")

for ((i=0; i<test_group_count; i++)); do
    group_name=$(jq -r ".tests[$i].name" "$TEST_FILE")
    header "$group_name"
    
    test_count=$(jq ".tests[$i].tests | length" "$TEST_FILE")
    
    for ((j=0; j<test_count; j++)); do
        test_name=$(jq -r ".tests[$i].tests[$j].name" "$TEST_FILE")
        method=$(jq -r ".tests[$i].tests[$j].method" "$TEST_FILE")
        path=$(jq -r ".tests[$i].tests[$j].path" "$TEST_FILE")
        expect_code=$(jq -r ".tests[$i].tests[$j].expectCode" "$TEST_FILE")
        expect_json=$(jq -r ".tests[$i].tests[$j].expectJson // true" "$TEST_FILE")
        
        # Replace variables in path
        path=$(replace_variables "$path")
        url="${BASE_URL}${path}"
        
        echo "🧪 $test_name"
        
        # Prepare request body
        body=""
        if jq -e ".tests[$i].tests[$j].body" "$TEST_FILE" >/dev/null; then
            body=$(jq -c ".tests[$i].tests[$j].body" "$TEST_FILE")
            body=$(replace_variables "$body")
        fi
        
        # Make API call
        response=$(api_call "$method" "$url" "$body" "$expect_code" "$expect_json")
        
        # Process assertions
        if jq -e ".tests[$i].tests[$j].assertions" "$TEST_FILE" >/dev/null; then
            echo "Checking assertions..." >&2
            while IFS='=' read -r assertion_key assertion_value; do
                if [[ -n "$assertion_key" && -n "$assertion_value" ]]; then
                    assert_json "$response" "$assertion_key" "$assertion_value"
                fi
            done < <(jq -r ".tests[$i].tests[$j].assertions | to_entries[] | \"\(.key)=\(.value)\"" "$TEST_FILE")
        fi
        
        # Capture variables
        if jq -e ".tests[$i].tests[$j].captureVariables" "$TEST_FILE" >/dev/null; then
            echo "Capturing variables..." >&2
            while IFS='=' read -r var_name json_path; do
                if [[ -n "$var_name" && -n "$json_path" ]]; then
                    captured_value=$(get_json_value "$response" "$json_path")
                    if [[ "$captured_value" != "null" && -n "$captured_value" ]]; then
                        set_var "$var_name" "$captured_value"
                        echo "Captured $var_name = $captured_value" >&2
                    else
                        echo "❌ Failed to capture $var_name from path $json_path" >&2
                        exit 1
                    fi
                fi
            done < <(jq -r ".tests[$i].tests[$j].captureVariables | to_entries[] | \"\(.key)=\(.value)\"" "$TEST_FILE")
        fi
        
        echo >&2
    done
done

echo
echo "✅ All API tests passed!"
echo "📊 Summary:"
echo "  - Test groups: $test_group_count"
total_tests=0
for ((i=0; i<test_group_count; i++)); do
    group_tests=$(jq ".tests[$i].tests | length" "$TEST_FILE")
    total_tests=$((total_tests + group_tests))
done
echo "  - Total tests: $total_tests"
captured_vars=$(wc -l < "$VARS_FILE" 2>/dev/null || echo "0")
echo "  - Variables captured: $captured_vars"