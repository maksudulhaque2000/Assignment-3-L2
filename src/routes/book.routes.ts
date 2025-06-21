import { Router } from "express";
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/book.controller";

const router = Router();

router.route("/").post(createBook).get(getAllBooks);

router.route("/:bookId").get(getBookById).put(updateBook).delete(deleteBook);

export default router;
