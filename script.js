const API_KEY = "AIzaSyATbVbbtd8gHtie-aD7aJams_RpsBUF6L4"; // Replace with your actual API key or use a secure method to load it

// Check if the placeholder key is still there
if (API_KEY === "YOUR_API_KEY") {
    alert("ERROR: Please replace 'YOUR_API_KEY' in script.js with your actual Google AI API Key. Remember to keep it secure and prefer using a backend for real applications.");
    }

// Import the GoogleGenerativeAI class directly using a browser-compatible ES Module URL
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

let genAI;
if (API_KEY && API_KEY !== "YOUR_API_KEY") {
    genAI = new GoogleGenerativeAI(API_KEY);
} else {
    console.error("API Key is missing or is still the placeholder value.");
    
    // We already alerted the user, maybe add a console log or disable the button permanently
    // if (!document.getElementById("genbutton").disabled) { // Check if not already disabled by alert
    //     document.getElementById("genbutton").disabled = true;
    //     document.getElementById("lettercontent").innerText = "API Key not configured. Please check script.js.";
    //     document.getElementById("letter").style.display = "block";
    // }

}

// Make the function globally available for the onclick handler
window.genletter = async function () {
    // Check if genAI was initialized successfully
    if (!genAI) {
         alert("API Key is not configured correctly. Cannot generate letter.");
         console.error("Attempted to generate letter without a valid genAI instance.");
         document.getElementById("lettercontent").innerText = "Error: API Key not configured.";
         document.getElementById("letter").style.display = "block";
         return; // Stop execution
    }

    const to = document.getElementById("to").value;
    const from = document.getElementById("from").value;
    const lettertype = document.getElementById("lettertype").value;
    const context = document.getElementById("context").value;
    const genbutton = document.getElementById("genbutton"); // Corrected button ID
    const lettercontent = document.getElementById("lettercontent");
    const letterDiv = document.getElementById("letter"); // Renamed variable for clarity

    // Basic validation
    if (!to || !from || !context) {
        alert("Please fill in 'To', 'From', and 'Context' fields.");
        return;
    }

    const prompt = `Write a ${lettertype} letter.
To: ${to}
From: ${from}
Context & additional details: ${context}
Give suitable subject line for the letter.
Structure the letter appropriately for the type specified. Ensure a professional tone for formal and business letters, and a more personal/friendly tone for informal, personal, or love letters, etc., as appropriate for the type "${lettertype}". Do not include any introductory text like "Here is the letter:" just provide the letter content itself, starting directly with the salutation (e.g., "Dear ${to},").`;

    // --- UI Update ---
    genbutton.disabled = true;
    lettercontent.innerText = "Generating letter, please wait...";
    letterDiv.style.display = "block"; // Make the results area visible

    try {
        // Get the generative model - Use a specific model name like 'gemini-1.5-flash-latest'
        // 'gemini-2.0-flash' might not be a valid/available model name.
        // Check Google's documentation for available model names.
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Corrected method name and model

        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Display result
        lettercontent.innerText = text;

    } catch (error) {
        console.error("Error generating letter:", error);
        // Provide more user-friendly error messages
        let errorMessage = "Error generating letter. Please check the console for details.";
        if (error.message.includes("API key not valid")) {
            errorMessage = "Error: Invalid API Key. Please check your API key in script.js.";
        } else if (error.message.includes("Quota exceeded")) {
            errorMessage = "Error: You have exceeded your API quota. Please check your Google AI Platform usage.";
        } else {
             errorMessage = "An unexpected error occurred: " + error.message;
        }
         lettercontent.innerText = errorMessage;
    } finally {
        // --- Re-enable button ---
        genbutton.disabled = false;
    }
}