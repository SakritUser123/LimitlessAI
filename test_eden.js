const EDEN_AI_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZThjZGUyZTEtNGQ2ZC00MzUzLWE3YzMtY2M5ZmQyMWUxY2FhIiwidHlwZSI6ImFwaV90b2tlbiJ9.r-hrvdUGqGbtnVWFbWUkElQSas014bz682FACyfUwxA';

async function testEdenAPI() {
  try {
    console.log('Testing Eden AI API...\n');
    
    const response = await fetch('https://api.edenai.run/v1/text/question_answer', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${EDEN_AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'What is 2+2?',
        providers: 'openai',
      }),
    });

    console.log(`Response status: ${response.status}`);
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Eden AI API is working!');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testEdenAPI();
