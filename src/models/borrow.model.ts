import mongoose, { Schema, Document } from "mongoose";

export interface IBorrow extends Document {
  book: mongoose.Types.ObjectId;
  quantity: number;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BorrowSchema: Schema<IBorrow> = new Schema(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Book ID is mandatory for borrowing"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is mandatory"],
      min: [1, "Quantity must be a positive number"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an integer number",
      },
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is mandatory"],
    },
  },
  {
    timestamps: true,
  },
);

const Borrow = mongoose.model<IBorrow>("Borrow", BorrowSchema);

export default Borrow;
