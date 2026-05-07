import express, { type ErrorRequestHandler } from "express";
import morgan from "morgan";
import taskRoutes from "./routes/tasks";

export function createApp() {
  const app = express();

  app.use(morgan("dev"));
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.send("ERS backend is live");
  });

  app.get("/ping", (_req, res) => {
    res.json({ message: "pong" });
  });

  app.use("/tasks", taskRoutes);

  const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
    console.error(err);

    if (res.headersSent) {
      return next(err);
    }

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  };

  app.use(errorHandler);

  return app;
}

export default createApp;
