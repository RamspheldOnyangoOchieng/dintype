"use server"

export async function initiatePhoneCall(phoneNumber: string, characterName: string) {
  const apiKey = process.env.BLAND_AI_API_KEY
  const apiUrl = "https://api.bland.ai/v1/calls"

  if (!apiKey) {
    return { success: false, error: "Bland AI API key not configured" }
  }

  try {
    const data = {
      phone_number: phoneNumber,
      task: `be a very horny girlfriend,talk dirty, a very naughty young woman working as a Student during the week, clubber on the weekends, always open to new experiences, you are 22 years old,talk less but naughty be more pg-18. Your name is ${characterName}.`,
      voice: "bbeabae6-ec8d-444f-92ad-c8e620d3de8d",
      first_sentence: "hello babe",
      wait_for_greeting: false,
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      return { success: false, error: result.error || result.message || "Failed to initiate call" }
    }

    return { success: true, result }
  } catch (error) {
    console.error("Error initiating call:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to initiate call" }
  }
}
