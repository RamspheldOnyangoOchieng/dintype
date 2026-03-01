
const NOVITA_API_KEY = "sk_hJfQmZjoV9V7bNQtNZ1g42CM1mSac8_LGSZOQBKDuh4";

async function checkBalance() {
    console.log("Checking Novita Balance...");
    try {
        const response = await fetch("https://api.novita.ai/v3/user/info", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${NOVITA_API_KEY}`,
            },
        });

        console.log("Status:", response.status);
        const data = await response.json();
        console.log("Response:", JSON.stringify(data, null, 2));

        if (response.status === 401 || response.status === 403) {
            console.log("❌ API Key is REJECTED or INSUFFICIENT BALANCE.");
        } else {
            console.log("✅ API Key is VALID.");
        }
    } catch (error) {
        console.error("Error checking balance:", error);
    }
}

checkBalance();
