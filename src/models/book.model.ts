import mongoose, { Schema, Document, Query } from "mongoose";

export enum BookGenre {
  FICTION = "FICTION",
  NON_FICTION = "NON_FICTION",
  SCIENCE = "SCIENCE",
  HISTORY = "HISTORY",
  BIOGRAPHY = "BIOGRAPHY",
  FANTASY = "FANTASY",
}

export interface IBook extends Document {
  title: string;
  author: string;
  genre: BookGenre;
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBookModel extends mongoose.Model<IBook> {
  borrowCopies(bookId: string, quantity: number): Promise<IBook | null>;
}

const BookSchema: Schema<IBook> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is mandatory"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Book author is mandatory"],
      trim: true,
    },
    genre: {
      type: String,
      required: [true, "Book genre is mandatory"],
      enum: {
        values: Object.values(BookGenre),
        message: `Genre must be one of: ${Object.values(BookGenre).join(", ")}`,
      },
    },
    isbn: {
      type: String,
      required: [true, "Book ISBN is mandatory"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    copies: {
      type: Number,
      required: [true, "Number of copies is mandatory"],
      min: [0, "Copies must be a non-negative number"],
      validate: {
        validator: Number.isInteger,
        message: "Copies must be an integer number",
      },
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

BookSchema.pre<IBook>("save", function (next) {
  this.available = this.copies > 0;
  next();
});

BookSchema.pre<Query<IBook, IBook>>("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as mongoose.UpdateQuery<IBook>;

  if (update && typeof update.copies === "number") {
    update.available = update.copies > 0;
  }
  next();
});

BookSchema.statics.borrowCopies = async function (
  bookId: string,
  quantity: number,
): Promise<IBook | null> {
  const book = await this.findById(bookId);

  if (!book) {
    return null;
  }

  if (book.copies < quantity) {
    throw new Error("Not enough copies available to borrow.");
  }

  book.copies -= quantity;
  await book.save();

  return book;
};

const Book = mongoose.model<IBook, IBookModel>("Book", BookSchema);

export default Book;
