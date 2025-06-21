# 📚 Library Management API

A robust and scalable Library Management System API built with **Express.js**, **TypeScript**, and **MongoDB (Mongoose)**. This API provides comprehensive functionalities for managing a library's book inventory and tracking borrowing records, ensuring data integrity through strong schema validation and business logic enforcement.

## ✨ Features

-   **Book Management (CRUD):**
    -   Create new book records with detailed information.
    -   Retrieve all books with robust filtering by `genre`, sorting (by `createdAt`, `title`, etc., in `asc`/`desc` order), and pagination (`limit`).
    -   Retrieve a single book by its unique ID.
    -   Update existing book details, including copy counts which automatically update availability.
    -   Delete book records.
-   **Borrowing System:**
    -   Record book borrowing transactions, automatically deducting available copies from the book's inventory.
    -   Enforce business logic to ensure sufficient copies are available before a borrow operation is permitted.
    -   Automatically update a book's `available` status to `false` if `copies` reach `0` (implemented via Mongoose middleware and static method).
-   **Data Validation:**
    -   Strict schema validation using Mongoose to ensure data consistency (e.g., mandatory fields, unique ISBN, enum for genre, non-negative copies).
-   **Business Logic Enforcement:**
    -   Availability control on borrow operations (e.g., preventing borrowing more copies than available).
-   **Data Aggregation:**
    -   Retrieve a summarized view of borrowed books, showing total borrowed quantity per book along with essential book details (title, ISBN).
-   **Mongoose Enhancements:**
    -   Utilizes **Mongoose middleware** (`pre` hooks) for automated updates to `available` status during save and update operations.
    -   Implements a **Mongoose static method** (`borrowCopies`) on the Book model to encapsulate the complex borrowing logic.
-   **Filtering & Sorting:** Dynamic querying for `GET /api/books` endpoint.
-   **Global Error Handling:** Provides consistent and informative error responses for validation failures, 404s, duplicate keys, and other server-side issues.

## 🚀 Technologies Used

-   **Node.js:** JavaScript runtime environment.
-   **Express.js:** Fast, unopinionated, minimalist web framework for Node.js.
-   **TypeScript:** Superset of JavaScript that adds static types, enhancing code quality and maintainability.
-   **MongoDB:** A NoSQL, document-oriented database.
-   **Mongoose:** An elegant MongoDB object data modeling (ODM) library for Node.js.
-   **Dotenv:** For loading environment variables from a `.env` file.
-   **Nodemon:** A utility that monitors for any changes in your source and automatically restarts your server.

## 🛠️ Setup & Installation

Follow these steps to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   **Node.js:** Ensure you have Node.js (LTS version recommended) installed. You can download it from [nodejs.org](https://nodejs.org/).
-   **npm:** Node Package Manager (comes with Node.js).
-   **MongoDB:** A running MongoDB instance.
    -   **Local:** You can install MongoDB Community Server.
    -   **Cloud:** MongoDB Atlas (recommended for ease of use). Your `MONGODB_URI` will be provided by Atlas.

### Installation Steps

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/maksudulhaque2000/Assignment-3-L2](https://github.com/maksudulhaque2000/Assignment-3-L2) # Replace with your actual repo URL
    cd library-management-api
    ```

2.  **Install project dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file:**
    In the root directory of your project, create a file named `.env` and add the following environment variables. Replace the placeholder values with your actual MongoDB connection string and preferred port.

    ```env
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.bjzga.mongodb.net/library_db?retryWrites=true&w=majority # Your MongoDB Atlas URI or local URI
    PORT=3000
    ```
    **Note for MongoDB Atlas:** Ensure you have a database user (`compass` in this example) with the correct password and that your current IP address is whitelisted in your Atlas cluster's Network Access settings.

### Running the Application

-   **Development Mode (with hot-reloading):**
    This command will start the server using `nodemon` and `ts-node`, automatically recompiling and restarting the server on file changes.

    ```bash
    npm run dev
    ```
    The server will typically run on `http://localhost:3000` (or the port specified in your `.env` file). You should see messages indicating successful MongoDB connection and server startup.

-   **Build and Run (Production Mode):**
    First, compile the TypeScript code to JavaScript, then run the compiled JavaScript.

    ```bash
    npm run build # Compiles TypeScript to JavaScript in the 'dist' folder
    npm start     # Runs the compiled JavaScript application
    ```

## 📋 API Endpoints

All API endpoints are prefixed with `/api`. For testing, you can use tools like [Postman](https://www.postman.com/downloads/), [Insomnia](https://insomnia.rest/download), or `curl`.

**Base URL:** `http://localhost:3000/api` (or `{{baseUrl}}` if using Postman environment variables)

---

### 1. Create Book

-   **URL:** `POST {{baseUrl}}/books`
-   **Description:** Creates a new book record in the database.
-   **Request Body (JSON):**
    ```json
    {
      "title": "The Theory of Everything",
      "author": "Stephen Hawking",
      "genre": "SCIENCE",
      "isbn": "9780553380163",
      "description": "An overview of cosmology and black holes.",
      "copies": 5,
      "available": true
    }
    ```
-   **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "message": "Book created successfully",
      "data": {
        "_id": "64f123abc4567890def12345",
        "title": "The Theory of Everything",
        "author": "Stephen Hawking",
        "genre": "SCIENCE",
        "isbn": "9780553380163",
        "description": "An overview of cosmology and black holes.",
        "copies": 5,
        "available": true,
        "createdAt": "2024-11-19T10:23:45.123Z",
        "updatedAt": "2024-11-19T10:23:45.123Z"
      }
    }
    ```

### 2. Get All Books

-   **URL:** `GET {{baseUrl}}/books`
-   **Description:** Retrieves a list of all books, with optional filtering, sorting, and limiting.
-   **Query Parameters:**
    -   `filter` (optional): Filter by `genre` (e.g., `FICTION`, `NON_FICTION`, `SCIENCE`, `HISTORY`, `BIOGRAPHY`, `FANTASY`). Case-insensitive (will be converted to uppercase internally).
    -   `sortBy` (optional): Field to sort the results by (e.g., `createdAt`, `title`, `author`).
    -   `sort` (optional): Sort order (`asc` for ascending, `desc` for descending). Default is `desc`.
    -   `limit` (optional): Maximum number of results to return. Default is `10`.
-   **Example Request:** `GET {{baseUrl}}/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5`
-   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Books retrieved successfully",
      "data": [
        {
          "_id": "64f123abc4567890def12345",
          "title": "The Theory of Everything",
          "author": "Stephen Hawking",
          "genre": "SCIENCE",
          "isbn": "9780553380163",
          "description": "An overview of cosmology and black holes.",
          "copies": 5,
          "available": true,
          "createdAt": "2024-11-19T10:23:45.123Z",
          "updatedAt": "2024-11-19T10:23:45.123Z"
        },
        { /* ... more book objects */ }
      ]
    }
    ```

### 3. Get Book by ID

-   **URL:** `GET {{baseUrl}}/books/:bookId`
-   **Description:** Retrieves a single book by its unique ID.
-   **Example Request:** `GET {{baseUrl}}/books/64f123abc4567890def12345`
-   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Book retrieved successfully",
      "data": {
        "_id": "64f123abc4567890def12345",
        "title": "The Theory of Everything",
        "author": "Stephen Hawking",
        "genre": "SCIENCE",
        "isbn": "9780553380163",
        "description": "An overview of cosmology and black holes.",
        "copies": 5,
        "available": true,
        "createdAt": "2024-11-19T10:23:45.123Z",
        "updatedAt": "2024-11-19T10:23:45.123Z"
      }
    }
    ```

### 4. Update Book

-   **URL:** `PUT {{baseUrl}}/books/:bookId`
-   **Description:** Updates an existing book record.
-   **Request Body (JSON):** (Send only the fields you want to update)
    ```json
    {
      "copies": 50,
      "description": "An updated summary or description."
    }
    ```
-   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Book updated successfully",
      "data": {
        "_id": "64f123abc4567890def12345",
        "title": "The Theory of Everything",
        "author": "Stephen Hawking",
        "genre": "SCIENCE",
        "isbn": "9780553380163",
        "description": "An updated summary or description.",
        "copies": 50,
        "available": true,
        "createdAt": "2024-11-19T10:23:45.123Z",
        "updatedAt": "2024-11-20T08:30:00.000Z"
      }
    }
    ```

### 5. Delete Book

-   **URL:** `DELETE {{baseUrl}}/books/:bookId`
-   **Description:** Deletes a book record from the database.
-   **Example Request:** `DELETE {{baseUrl}}/books/64f123abc4567890def12345`
-   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Book deleted successfully",
      "data": null
    }
    ```

### 6. Borrow a Book

-   **URL:** `POST {{baseUrl}}/borrow`
-   **Description:** Records a book borrowing transaction, deducting copies and updating book availability.
-   **Business Logic:**
    -   Verifies the book has enough available copies.
    -   Deducts the requested quantity from the book’s `copies`.
    -   If `copies` become `0`, `available` status is updated to `false`.
-   **Request Body (JSON):**
    ```json
    {
      "book": "64ab3f9e2a4b5c6d7e8f9012",
      "quantity": 2,
      "dueDate": "2025-07-18T00:00:00.000Z"
    }
    ```
-   **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "message": "Book borrowed successfully",
      "data": {
        "_id": "64bc4a0f9e1c2d3f4b5a6789",
        "book": "64ab3f9e2a4b5c6d7e8f9012",
        "quantity": 2,
        "dueDate": "2025-07-18T00:00:00.000Z",
        "createdAt": "2025-06-18T07:12:15.123Z",
        "updatedAt": "2025-06-18T07:12:15.123Z"
      }
    }
    ```

### 7. Borrowed Books Summary (Aggregation)

-   **URL:** `GET {{baseUrl}}/borrow`
-   **Description:** Returns a summarized view of borrowed books, showing the total borrowed quantity for each book along with its title and ISBN.
-   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Borrowed books summary retrieved successfully",
      "data": [
        {
          "book": {
            "title": "The Theory of Everything",
            "isbn": "9780553380163"
          },
          "totalQuantity": 5
        },
        {
          "book": {
            "title": "1984",
            "isbn": "9780451524935"
          },
          "totalQuantity": 3
        }
      ]
    }
    ```

## ⚠️ Error Responses

The API returns consistent error responses for various failure scenarios (e.g., validation errors, 404 Not Found, duplicate key errors, insufficient copies).

```json
{
  "message": "Validation failed",
  "success": false,
  "error": {
    "name": "ValidationError",
    "errors": {
      "copies": {
        "message": "Copies must be a non-negative number",
        "name": "ValidatorError",
        "properties": {
          "message": "Copies must be a non-negative number",
          "type": "min",
          "min": 0
        },
        "kind": "min",
        "path": "copies",
        "value": -5
      }
    }
  }
}
```
## 🎥 Video Explanation (Bonus)

A short recorded video explaining key features, business logic, and architectural choices, along with a live demonstration of the API endpoints using Postman or Insomnia.
[Video](https://github.com/maksudulhaque2000)

## 🤝 Contributing

Feel free to fork the repository, open issues, or submit pull requests if you have suggestions or improvements!

## 📄 License

This project is licensed under the Haque's License.