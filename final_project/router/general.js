const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];

  Object.keys(books).forEach((key) => {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      booksByAuthor.push({ isbn: key, ...books[key] });
    }
  });

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let booksByTitle = [];

  Object.keys(books).forEach((key) => {
    if (books[key].title.toLowerCase().includes(title.toLowerCase())) {
      booksByTitle.push({ isbn: key, ...books[key] });
    }
  });

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 10: Get all books using async-await with Axios
public_users.get('/async', async function (req, res) {
  try {
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        resolve(books);
      });
    };
    const allBooks = await getBooks();
    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11: Get book details based on ISBN using async-await with Axios
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject(new Error("Book not found"));
        }
      });
    };
    const book = await getBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 12: Get book details based on Author using async-await
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const getBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        let booksByAuthor = [];
        Object.keys(books).forEach((key) => {
          if (books[key].author.toLowerCase() === author.toLowerCase()) {
            booksByAuthor.push({ isbn: key, ...books[key] });
          }
        });
        if (booksByAuthor.length > 0) {
          resolve(booksByAuthor);
        } else {
          reject(new Error("No books found by this author"));
        }
      });
    };
    const result = await getBooksByAuthor(author);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 13: Get book details based on Title using async-await
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const getBooksByTitle = (title) => {
      return new Promise((resolve, reject) => {
        let booksByTitle = [];
        Object.keys(books).forEach((key) => {
          if (books[key].title.toLowerCase().includes(title.toLowerCase())) {
            booksByTitle.push({ isbn: key, ...books[key] });
          }
        });
        if (booksByTitle.length > 0) {
          resolve(booksByTitle);
        } else {
          reject(new Error("No books found with this title"));
        }
      });
    };
    const result = await getBooksByTitle(title);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

module.exports.general = public_users;
