// src/app.ts
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import bookRoutes from "./routes/book.routes";
import borrowRoutes from "./routes/borrow.routes";
import errorHandler from "./middleware/errorHandler";
import ApiResponse from "./utils/apiResponse";
import cors from "cors"; // <-- এই লাইনটি যোগ করা হয়েছে

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

// --- নতুন: CORS মিডলওয়্যার ---
// এটি সকল অরিজিন থেকে অনুরোধের অনুমতি দেবে।
// ডেভেলপমেন্টের জন্য এটি ঠিক আছে, কিন্তু প্রোডাকশনের জন্য নির্দিষ্ট অরিজিন সেট করা উচিত।
app.use(cors());
// যদি আপনি নির্দিষ্ট অরিজিন থেকে অনুরোধের অনুমতি দিতে চান, তাহলে নিচের কোডটি ব্যবহার করুন:
/*
app.use(cors({
  origin: 'http://localhost:3000', // আপনার ফ্রন্টএন্ডের ডেভেলপমেন্ট URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // আপনার API যেসব HTTP মেথড সমর্থন করে
  allowedHeaders: ['Content-Type', 'Authorization'], // আপনার API যেসব হেডার ব্যবহার করে
}));
*/
// ----------------------------

app.use(express.json());

app.get("/", (req, res) => {
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Welcome to the Library Management API! Access API endpoints via /api/books or /api/borrow.",
      ),
    );
});

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
