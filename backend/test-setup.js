#!/usr/bin/env node

const http = require('http');

console.log('🧪 Testing Node.js API Setup...\n');

// Test health endpoint
const testHealth = () => {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3000/health', res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('✅ Health Check:', response.message);
          resolve(response);
        } catch (error) {
          console.log('❌ Health Check failed to parse response');
          reject(error);
        }
      });
    });

    req.on('error', error => {
      console.log('❌ Health Check failed:', error.message);
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      console.log('❌ Health Check timeout');
      reject(new Error('Timeout'));
    });
  });
};

// Test create user endpoint
const testCreateUser = () => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      name: 'Test User',
      email: 'test@example.com',
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/users',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('✅ Create User:', response.message);
          resolve(response);
        } catch (error) {
          console.log('❌ Create User failed to parse response');
          reject(error);
        }
      });
    });

    req.on('error', error => {
      console.log('❌ Create User failed:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
};

// Test get users endpoint
const testGetUsers = () => {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3000/api/users', res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('✅ Get Users:', `Found ${response.data.length} users`);
          resolve(response);
        } catch (error) {
          console.log('❌ Get Users failed to parse response');
          reject(error);
        }
      });
    });

    req.on('error', error => {
      console.log('❌ Get Users failed:', error.message);
      reject(error);
    });
  });
};

// Run tests
const runTests = async () => {
  try {
    console.log('Starting tests...\n');

    await testHealth();
    await testCreateUser();
    await testGetUsers();

    console.log('\n🎉 All tests passed! Your API is working correctly.');
    console.log('\n📚 Next steps:');
    console.log('1. Start Docker Desktop');
    console.log('2. Run: docker-compose up -d');
    console.log('3. Test with: curl http://localhost:3000/health');
  } catch (error) {
    console.log('\n❌ Tests failed. Make sure your server is running:');
    console.log('1. Run: yarn dev');
    console.log('2. Wait for server to start');
    console.log('3. Run this test again');
  }
};

runTests();
