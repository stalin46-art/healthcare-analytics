const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const { getActiveProvider, getSetupInstructions } = require("./services/aiService");

const path = require("path");
dotenv.config({ path: path.join(__dirname, ".env") });

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/patients", require("./routes/patientRoutes"));

app.get("/api/ai/status", (_req, res) => {
  const provider = getActiveProvider();
  const instructions = getSetupInstructions();

  res.json({
    enabled: provider !== "rules",
    provider,
    message:
      provider === "rules"
        ? "No free cloud AI key set. Add GEMINI_API_KEY to backend/.env (free at aistudio.google.com/apikey)."
        : `AI risk prediction active via ${provider}.`,
    setup: instructions,
  });
});

// Serve frontend static assets in production or when dist build exists
const distPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(distPath));

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: "API route not found" });
  }
  const indexPath = path.join(distPath, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(500).send("Frontend build not found. Please run 'npm run build'.");
    }
  });
});

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  const provider = getActiveProvider();
  console.log(`Server running on port ${PORT}`);
  console.log(
    provider === "rules"
      ? "AI: inactive — add a free GEMINI_API_KEY from https://aistudio.google.com/apikey"
      : `AI: active via ${provider} (cloud)`
  );
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Update backend/.env or stop the process using that port.`
    );
    process.exit(1);
  }
  throw error;
});