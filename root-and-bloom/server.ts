import express from "express";
import path from "node:path";
import { createServer as createViteServer } from "vite";
import { createProxyMiddleware } from "http-proxy-middleware";
import "dotenv/config";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PUBLIC_PORT || 3000);
  const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:3001";

  app.disable("x-powered-by");

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      appType: "spa",
      server: {
        middlewareMode: true,
        host: "127.0.0.1",
        port: PORT,
        proxy: {
          "/api": {
            target: "http://127.0.0.1:3001",
            changeOrigin: true,
          },
        },
      },
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use("/api", createProxyMiddleware({ target: backendUrl, changeOrigin: true }));
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", app: "Root & Bloom public storefront" });
  });

  app.listen(PORT, "127.0.0.1", () => {
    console.log(`Root & Bloom public storefront running on http://127.0.0.1:${PORT}`);
  });
}

startServer();
