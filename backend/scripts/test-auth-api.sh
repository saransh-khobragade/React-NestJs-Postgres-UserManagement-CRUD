#!/bin/bash

API_BASE_URL="http://localhost:8080"

echo "Testing Simple Auth API"
echo "======================"

# Test 1: Signup
echo "1. Testing User Signup"
curl -X POST "${API_BASE_URL}/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

echo -e "\n\n2. Testing User Login"
curl -X POST "${API_BASE_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

echo -e "\n\n3. Testing Get All Users"
curl -X GET "${API_BASE_URL}/api/users"

echo -e "\n\n✅ Simple API tests completed!" 