const nextBuildId = require('next-build-id');
const withPWA = require('next-pwa');

module.exports = withPWA({
    reactStrictMode: false,
    compiler: {
        styledComponents: true,
    },
    generateBuildId: async () => {
        const id = await nextBuildId({dir: __dirname});
        console.log('Generating build hash for NextJS modules:', id);
        return id;
    },
    pwa: {
        dest: 'public',
        register: true
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'same-origin'
                    },
                    {
                        key: 'Cross-Origin-Embedder-Policy',
                        value: 'require-corp'
                    }
                ]
            }
        ];
    }
});