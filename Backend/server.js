require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/database");

async function startServer() {
  if (process.env.MONGO_URI) {
    try {
      await connectDB();
    } catch (err) {
      console.error("Database connection failed:", err.message);
    }
  } else {
    console.warn("MONGO_URI is missing. Database connection skipped.");
  }

  const port = process.env.PORT || 3000;
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer();
