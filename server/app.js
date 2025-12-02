import dotenvFlow from "dotenv-flow";
dotenvFlow.config();
import express from "express";
import http from "http";

import cors from "cors";
import bodyParser from "body-parser";
import { initializePostgres } from "./config/prisma.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger-config.js";
import swaggerAuth from "./middleware/swaggerAuth.js";
import subscriptionRouter from "./api/stripe/subscription/index.js";
import subscriptionRouterWebHook from "./api/stripe/subscription/index.js";
import apiRouter from "./routes/routes.js";
import { importStripePlans } from "./utils/planMigration.js";
import { Server } from "socket.io";
import notificationHandler from "./socket/notificationHandler.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
notificationHandler(io);
app.use(cors());
app.use(
  "/api/subscription/savedb/webhook",
  bodyParser.raw({ type: "application/json" }),
  subscriptionRouterWebHook
);

app.use(express.json());
app.use("/api/subscription/savedb", subscriptionRouter);

app.use("/api", apiRouter);

app.use(
  "/api-docs",
  swaggerAuth,
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: { persistAuthorization: true },
  })
);

await initializePostgres();

importStripePlans()
  .then(() => console.log("Plans imported on server start"))
  .catch((err) => console.error("Failed to import plans:", err));

server.listen(8087, () => console.log("server running on port 8087"));

export default app;
