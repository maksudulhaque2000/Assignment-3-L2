import { Request, Response, NextFunction } from "express";
import Book, { BookGenre, IBook } from "../models/book.model";
import ApiResponse from "../utils/apiResponse";
import ApiError from "../utils/apiError";

interface GetAllBooksQuery {
  filter?: BookGenre;
  sortBy?: keyof IBook;
  sort?: "asc" | "desc";
  limit?: string;
}

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res
      .status(201)
      .json(new ApiResponse(201, newBook, "Book created successfully"));
  } catch (error: unknown) {
    next(error);
  }
};

export const getAllBooks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { filter, sortBy, sort, limit } = req.query as GetAllBooksQuery;

    const query: { genre?: BookGenre } = {};

    if (filter) {
      const upperCaseFilter = filter.toString().toUpperCase();
      if (Object.values(BookGenre).includes(upperCaseFilter as BookGenre)) {
        query.genre = upperCaseFilter as BookGenre;
      } else {
        throw new ApiError(
          400,
          `Invalid genre filter: '${filter}'. Must be one of: ${Object.values(BookGenre).join(", ")}.`,
        );
      }
    }

    const sortOptions: { [key: string]: 1 | -1 } = {};
    if (sortBy) {
      if (
        [
          "title",
          "author",
          "genre",
          "isbn",
          "copies",
          "createdAt",
          "updatedAt",
        ].includes(sortBy as string)
      ) {
        sortOptions[sortBy as string] = sort === "asc" ? 1 : -1;
      } else {
        throw new ApiError(400, `Invalid sortBy parameter: '${sortBy}'.`);
      }
    } else {
      sortOptions.createdAt = -1;
    }

    const parsedLimit = parseInt(limit as string, 10) || 10;
    if (parsedLimit <= 0) {
      throw new ApiError(400, "Limit must be a positive number.");
    }

    const books = await Book.find(query).sort(sortOptions).limit(parsedLimit);

    res
      .status(200)
      .json(new ApiResponse(200, books, "Books retrieved successfully"));
  } catch (error: unknown) {
    next(error);
  }
};

export const getBookById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);

    if (!book) {
      throw new ApiError(404, "Book not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, book, "Book retrieved successfully"));
  } catch (error: unknown) {
    next(error);
  }
};

export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { bookId } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(bookId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBook) {
      throw new ApiError(404, "Book not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, updatedBook, "Book updated successfully"));
  } catch (error: unknown) {
    next(error);
  }
};

export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { bookId } = req.params;
    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      throw new ApiError(404, "Book not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, null, "Book deleted successfully"));
  } catch (error: unknown) {
    next(error);
  }
};
