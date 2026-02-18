import { defineConfig } from 'vite';

export default defineConfig({
    // Serve game.html as the root page so mobile preview matches network exactly
    appType: 'mpa',
    build: {
        rollupOptions: {
            input: {
                main: 'game.html',
                preview: 'index.html',
            },
        },
    },
    server: {
        // Redirect / to /game.html so mobile preview matches network
        proxy: {},
    },
    plugins: [
        {
            name: 'redirect-root-to-game',
            configureServer(server) {
                server.middlewares.use((req, res, next) => {
                    // Redirect root "/" to "/game.html"
                    if (req.url === '/' || req.url === '/index.html') {
                        res.writeHead(302, { Location: '/game.html' });
                        res.end();
                        return;
                    }
                    next();
                });
            },
        },
    ],
});
