import * as pwa from "@ducanh2912/next-pwa";

const withPWA = pwa.default({
    dest: 'public',
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    swcMinify: true,
    fallback: {
        document: "/offline"
    }
});


const nextConfig = {
    reactStrictMode: true,
};

export default withPWA(nextConfig);
