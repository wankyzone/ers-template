import { createServer } from "./server";

const PORT = process.env.PORT || 5000;

const app = createServer();

app.listen(PORT, () => {
  console.log(`🚀 ERS backend running on http://localhost:${PORT}`);
});
