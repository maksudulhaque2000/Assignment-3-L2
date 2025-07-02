import { Request, Response, NextFunction } from "express";
import Book, { BookGenre, IBook } from "../models/book.model";
import ApiResponse from "../utils/apiResponse";
import ApiError from "../utils/apiError";

interface GetAllBooksQuery {
  filter?: BookGenre;
  sortBy?: keyof IBook;
  sort?: "asc" | "desc";
  limit?: string;
  page?: string;
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
    const { filter, sortBy, sort, limit, page } = req.query as GetAllBooksQuery;

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

    const itemsPerPage = parseInt(limit as string, 10) || 10;
    const currentPage = parseInt(page as string, 10) || 1;
    const skip = (currentPage - 1) * itemsPerPage;

    const totalItems = await Book.countDocuments(query);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const books = await Book.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(itemsPerPage);

    res.status(200).json(
      new ApiResponse(200, books, "Books retrieved successfully", {
        currentPage: currentPage,
        itemsPerPage: itemsPerPage,
        totalItems: totalItems,
        totalPages: totalPages,
      }),
    );
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
