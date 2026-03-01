
const NOVITA_API_KEY = "sk_hJfQmZjoV9V7bNQtNZ1g42CM1mSac8_LGSZOQBKDuh4";

async function testModel(model) {
    console.log(`\n--- Testing Model: ${model} ---`);
    try {
        const response = await fetch("https://api.novita.ai/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${NOVITA_API_KEY}`
            },
            body: JSON.stringify({
                "model": model,
                "messages": [
                    { "role": "user", "content": "Say hello" }
                ]
            })
        });

        console.log("Status:", response.status);
        const data = await response.json();
        if (response.ok) {
            console.log("Response:", data.choices[0].message.content);
            console.log(`✅ ${model} works!`);
        } else {
            console.log("Error:", JSON.stringify(data, null, 2));
            console.log(`❌ ${model} failed!`);
        }
    } catch (error) {
        console.error(`Test Error for ${model}:`, error);
    }
}

async function run() {
    await testModel("deepseek/deepseek-v3.1");
    await testModel("meta-llama/llama-3.1-8b-instruct");
}

run();
