import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const API_KEY = "AIzaSyATbVbbtd8gHtie-aD7aJams_RpsBUF6L4";

// if (API_KEY === "YOUR_API_KEY") {
//     alert("ERROR: Please replace 'YOUR_API_KEY' in script.js with your actual Google AI API Key. Remember to keep it secure and prefer using a backend for real applications.");
// }

let genAI;
if (API_KEY && API_KEY !== "YOUR_API_KEY") {
    genAI = new GoogleGenerativeAI(API_KEY);
} else {
    console.error("API Key is missing or is still the placeholder value.");

    // if (!document.getElementById("genbutton").disabled) {
    //     document.getElementById("genbutton").disabled = true;
    //     document.getElementById("lettercontent").innerText = "API Key not configured. Please check script.js.";
    //     document.getElementById("letter").style.display = "block";
    // }

}

window.genletter = async function () {
    if (!genAI) {
        alert("API Key is not configured correctly. Cannot generate letter.");
        console.error("Attempted to generate letter without a valid genAI instance.");
        document.getElementById("lettercontent").innerText = "Error: API Key not configured.";
        document.getElementById("letter").style.display = "block";
        return;
    }

    const to = document.getElementById("to").value;
    const from = document.getElementById("from").value;
    const lettertype = document.getElementById("lettertype").value;
    const context = document.getElementById("context").value;
    const genbutton = document.getElementById("genbutton");
    const lettercontent = document.getElementById("lettercontent");
    const letterDiv = document.getElementById("letter");
    const date = document.getElementById("date").value;
    const additional = document.getElementById("additional").value;

    if (!to || !from || !context) {
        alert("Please fill in 'To', 'From', and 'Context' fields.");
        return;
    }

    const prompt = 
    `Write a ${lettertype} letter.
    Date: ${date}
    To: ${to}
    From: ${from}
    Context: ${context}
    ${additional ? "Additional: " + additional : ""} 
    Give suitable subject line for the letter.
    Structure the letter appropriately for the type specified. Ensure a professional tone for formal and business letters, and a more personal/friendly tone for informal, personal, or love letters, etc., as appropriate for the type "${lettertype}". Do not include any introductory text like "Here is the letter:" just provide the letter content itself, starting directly with the salutation (e.g., "Dear ${to},").`;

    genbutton.disabled = true;
    lettercontent.innerText = "Generating letter, please wait...";
    letterDiv.style.display = "block";

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        lettercontent.innerText = text;

    } catch (error) {
        console.error("Error generating letter:", error);
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
        genbutton.disabled = false;
    }
}