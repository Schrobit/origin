const axios = require('axios');

async function testStatusApi() {
  try {
    const response = await axios.post('http://localhost:3000/status', {
      status: 'off'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testStatusApi();