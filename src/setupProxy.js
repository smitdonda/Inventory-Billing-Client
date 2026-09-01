const { createProxyMiddleware } = require("http-proxy-middleware");

/*
 * Development mirror of the production rewrite in vercel.json.
 *
 * The session is an httpOnly cookie now, and a cookie is only reliably kept if
 * it is first-party. So the app always talks to /api on its own origin and the
 * host forwards that to the API server — here the CRA dev server, in
 * production Vercel. Nothing cross-site, nothing for a browser's third-party
 * cookie rules to block.
 *
 * CRA loads this file automatically; it is never bundled into the app.
 */
module.exports = function setupProxy(app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: process.env.DEV_API_URL || "http://localhost:5000",
      changeOrigin: false,
      // The API serves /products, not /api/products.
      pathRewrite: { "^/api": "" },
      logLevel: "warn",
    })
  );
};
