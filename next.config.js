/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['pdf2json'],
    },
    //output: "export",
    env: {
        MONGO: process.env.MONGO,
        MONGO_URI: process.env.MONGO_URI, // Server-side variable
    },
}

module.exports = nextConfig
