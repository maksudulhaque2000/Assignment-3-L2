import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import bookRoutes from "./routes/book.routes";
import borrowRoutes from "./routes/borrow.routes";
import errorHandler from "./middleware/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Not Found",
    success: false,
    error: {
      name: "NotFound",
      message: `The requested URL ${req.originalUrl} was not found on this server.`,
    },
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
