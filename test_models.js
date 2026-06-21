const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testModels() {
  const models = ['gpt-3.5-turbo', 'gpt-4-mini', 'gpt-4o-mini', 'gpt-4o'];
  
  for (const model of models) {
    try {
      console.log(`Testing ${model}...`);
      const response = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'user',
            content: 'test'
          }
        ],
        max_tokens: 1
      });
      console.log(`✅ ${model} works!\n`);
      return model;
    } catch (e) {
      console.log(`❌ ${model} failed: ${e.message.split('\n')[0]}\n`);
    }
  }
}

testModels();
