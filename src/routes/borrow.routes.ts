import { Router } from "express";
import {
  borrowBook,
  getBorrowedBooksSummary,
} from "../controllers/borrow.controller";

const router = Router();

router.route("/").post(borrowBook).get(getBorrowedBooksSummary);

export default router;
