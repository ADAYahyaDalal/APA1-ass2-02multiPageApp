const express = require('express');
const app = express();
const port = 3000;

// Set up Pug as the view engine
app.set('view engine', 'pug');
app.set('views', './views');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

//req.body:
// Contains the data sent in the POST request body (e.g., form submissions or JSON payloads).
// Requires middleware (e.g., express.json() or express.urlencoded()) to parse the request body into a usable format

// Sample data
const books = [
  { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960, genre: "Fiction" },
  { id: 2, title: "1984", author: "George Orwell", year: 1949, genre: "Science Fiction" },
  { id: 3, title: "Pride and Prejudice", author: "Jane Austen", year: 1813, genre: "Romance" }
];

const authors = [
  { id: 1, name: "Harper Lee", birthYear: 1926, nationality: "American" },
  { id: 2, name: "George Orwell", birthYear: 1903, nationality: "British" },
  { id: 3, name: "Jane Austen", birthYear: 1775, nationality: "British" }
];

// Route for home page (list view)
app.get('/', (req, res) => {   
  res.render('home', { books: books });
});

 //request and response

// Route for book details
app.get('/book/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).render('404');
  res.render('book-details', { book: book });
});


// '/book/:id':
// Defines a route with a parameter (:id).
// The :id is a dynamic placeholder, allowing the route to handle requests like /book/1, /book/42, etc.

//
// books.find(...): Searches the array for a book whose id matches the parsed id from the URL.
// parseInt(req.params.id): Converts the id from a string to an integer, ensuring proper comparison.
// If a book with the matching id is found, it is stored in the book variable.

// { book: book }: Passes the book object to the template for rendering.
// The book-details template will have access to the book object, allowing it to display details like the book's title, author, etc.

// Request: GET /book/1
// req.params.id: '1'
// parseInt(req.params.id): 1
// books.find(...): Finds the book { id: 1, title: 'JavaScript Basics', author: 'John Doe' }.
// Renders the book-details template, passing the book object to it.
// Request: GET /book/42
// req.params.id: '42'
// books.find(...): Returns undefined (no match).
// Sends a 404 response and renders the 404 template.

// Route for add book page (form)
app.get('/add-book', (req, res) => {
  res.render('add-book');
});

// Route to handle adding a new book
app.post('/add-book', (req, res) => { //POST routes are typically used for creating or updating resources on the server.
  const newBook = {
    id: books.length + 1,
    title: req.body.title, //// Takes the title from the request body
    author: req.body.author,
    year: parseInt(req.body.year), //// Converts the year from string to an integer
    genre: req.body.genre
  };
  books.push(newBook);
  res.redirect('/');
});

// res.redirect('/'):
// Redirects the user to the homepage (/) after successfully adding the new book.
// Typically, the homepage would list all the books, including the newly added one.

// Route for authors page (table view)
app.get('/authors', (req, res) => {
  res.render('authors', { authors: authors });
});

app.get('/edit-book/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  console.log(book); // This will log the book object to the console
  if (!book) return res.status(404).render('404');
  res.render('edit-book', { title: 'Edit Book', book: book });
});


// Route to handle saving the edited book
app.post('/edit-book/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);
  
  if (!book) {
    return res.status(404).render('404'); // Render 404 if the book is not found
  }

  // Update the book details from the form
  book.title = req.body.title;
  book.author = req.body.author;
  book.year = parseInt(req.body.year);
  book.genre = req.body.genre;

  // Redirect to the homepage or another page after saving
  res.redirect('/');
});

// Start the server
app.listen(port, () => {
  console.log(`Book Library app listening at http://localhost:${port}`);
});

