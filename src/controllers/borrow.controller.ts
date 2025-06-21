import { Request, Response, NextFunction } from "express";
import Borrow from "../models/borrow.model";
import Book, { IBookModel } from "../models/book.model";
import ApiResponse from "../utils/apiResponse";
import ApiError from "../utils/apiError";
import mongoose from "mongoose";

export const borrowBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { book: bookId, quantity, dueDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      throw new ApiError(400, "Invalid Book ID provided.");
    }

    const updatedBook = await (Book as IBookModel).borrowCopies(
      bookId,
      quantity,
    );

    if (!updatedBook) {
      throw new ApiError(404, "Book not found for borrowing.");
    }

    const newBorrow = new Borrow({
      book: bookId,
      quantity,
      dueDate,
    });

    await newBorrow.save();

    res
      .status(201)
      .json(new ApiResponse(201, newBorrow, "Book borrowed successfully"));
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message === "Not enough copies available to borrow."
    ) {
      next(new ApiError(400, error.message));
    } else {
      next(error);
    }
  }
};

export const getBorrowedBooksSummary = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      {
        $unwind: "$bookDetails",
      },
      {
        $project: {
          _id: 0,
          book: {
            title: "$bookDetails.title",
            isbn: "$bookDetails.isbn",
          },
          totalQuantity: 1,
        },
      },
    ]);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          summary,
          "Borrowed books summary retrieved successfully",
        ),
      );
  } catch (error: unknown) {
    next(error);
  }
};
