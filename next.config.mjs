import * as pwa from "@ducanh2912/next-pwa";

const withPWA = pwa.default({
    dest: 'public',
    cacheOnFrontEndNav: true,
    aggresiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    swcMinify: true,
    fallback: {
        document: "/offline"
    }
});
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
};

export default withPWA(nextConfig);
