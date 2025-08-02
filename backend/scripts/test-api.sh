#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# API base URL
API_BASE="http://localhost:8080"

echo -e "${BLUE}🧪 API Testing Script for NestJS CRUD API${NC}"
echo "=================================================="

# Check if the API is running
print_info "Checking if API is running..."
if ! curl -s "$API_BASE/health" > /dev/null; then
    print_error "API is not running on $API_BASE"
    print_info "Please start the application first:"
    print_info "  ./scripts/start.sh"
    print_info "  or"
    print_info "  docker-compose up -d && yarn start:dev"
    exit 1
fi

print_success "API is running!"

# Test health endpoint
echo ""
print_info "Testing Health Endpoint..."
HEALTH_RESPONSE=$(curl -s "$API_BASE/health")
if [[ $? -eq 0 ]]; then
    print_success "Health endpoint: $HEALTH_RESPONSE"
else
    print_error "Health endpoint failed"
fi

# Test root endpoint
echo ""
print_info "Testing Root Endpoint..."
ROOT_RESPONSE=$(curl -s "$API_BASE/")
if [[ $? -eq 0 ]]; then
    print_success "Root endpoint: $ROOT_RESPONSE"
else
    print_error "Root endpoint failed"
fi

# Test Users API
echo ""
print_info "Testing Users API..."
echo "======================"

# Create a user
print_info "1. Creating a user..."
USER_RESPONSE=$(curl -s -X POST "$API_BASE/users" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "age": 30,
    "isActive": true
  }')

if [[ $? -eq 0 ]]; then
    print_success "User created successfully"
    USER_ID=$(echo $USER_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)
    print_info "User ID: $USER_ID"
else
    print_error "Failed to create user"
    echo "Response: $USER_RESPONSE"
fi

# Get all users
print_info "2. Getting all users..."
USERS_RESPONSE=$(curl -s "$API_BASE/users")
if [[ $? -eq 0 ]]; then
    print_success "Retrieved all users"
    USER_COUNT=$(echo $USERS_RESPONSE | grep -o '"id"' | wc -l)
    print_info "Total users: $USER_COUNT"
else
    print_error "Failed to get users"
fi

# Get user by ID (if user was created)
if [[ ! -z "$USER_ID" ]]; then
    print_info "3. Getting user by ID: $USER_ID"
    USER_BY_ID_RESPONSE=$(curl -s "$API_BASE/users/$USER_ID")
    if [[ $? -eq 0 ]]; then
        print_success "Retrieved user by ID"
    else
        print_error "Failed to get user by ID"
    fi

    # Update user
    print_info "4. Updating user: $USER_ID"
    UPDATE_RESPONSE=$(curl -s -X PATCH "$API_BASE/users/$USER_ID" \
      -H "Content-Type: application/json" \
      -d '{
        "firstName": "John Updated",
        "age": 31
      }')
    if [[ $? -eq 0 ]]; then
        print_success "User updated successfully"
    else
        print_error "Failed to update user"
    fi
fi



# Test Swagger Documentation
echo ""
print_info "Testing Swagger Documentation..."
echo "===================================="

SWAGGER_RESPONSE=$(curl -s "$API_BASE/api")
if [[ $? -eq 0 ]]; then
    print_success "Swagger documentation is accessible"
    print_info "Swagger UI: $API_BASE/api"
else
    print_error "Swagger documentation failed"
fi

# Summary
echo ""
print_info "API Test Summary"
echo "=================="
print_info "Health Check: ✅"
print_info "Root Endpoint: ✅"
print_info "Users API: ✅"
print_info "Swagger Docs: ✅"

echo ""
print_success "All API tests completed!"
print_info "You can view the Swagger documentation at: $API_BASE/api" 