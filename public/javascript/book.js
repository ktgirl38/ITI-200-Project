// ---------------------------
// GET USER
// ---------------------------
const username = localStorage.getItem("username");
const bookAuthorParam = params.get("author");

if (!username) {
    alert("Please log in to track your books.");
    window.location.href = "login.html";
}

// ---------------------------
// GET TITLE + AUTHOR FROM URL
// ---------------------------
const params = new URLSearchParams(window.location.search);
const bookTitle = params.get("title");
const bookAuthor = params.get("author");   // <-- You forgot this earlier

// ---------------------------
// SELECT DOM ELEMENTS
// ---------------------------
const bookCover = document.getElementById("bookCover");
const bookTitleElem = document.getElementById("bookTitle");
const bookAuthorElem = document.getElementById("bookAuthor");
const bookISBNElem = document.getElementById("bookISBN");
const bookPublisherElem = document.getElementById("bookPublisher");
const bookPagesElem = document.getElementById("bookPages");
const currentPageInput = document.getElementById("currentPage");
const shelfSelect = document.getElementById("shelfSelect");
const saveBtn = document.getElementById("saveProgress");
const discussionLink = document.getElementById("discussionLink");

// ---------------------------
// LOAD BOOK DETAILS FROM SERVER
// ---------------------------
async function loadBook() {
    const url = `/api/book?title=${encodeURIComponent(bookTitle)}&author=${encodeURIComponent(bookAuthorParam)}`;

    const response = await fetch(url);
    if (!response.ok) {
        alert("Book not found.");
        return;
    }

    const book = await response.json();

    // Fill in HTML
    bookCover.src = book.cover;
    bookTitleElem.textContent = book.title;
    bookAuthorElem.textContent = book.author;
    bookISBNElem.textContent = book.isbn || "N/A";
    bookPublisherElem.textContent = book.publisher || "N/A";
    bookPagesElem.textContent = book.pagenum || "Unknown";

    // Discussion link
    discussionLink.href = `discussions/${book.title.replace(/\s/g, '')}.html`;

    // If the user has reading stats, load them
    if (book.currentpage) currentPageInput.value = book.currentpage;
    if (book.readingstatus) shelfSelect.value = book.readingstatus;
}

// ---------------------------
// SAVE PROGRESS
// ---------------------------
saveBtn.addEventListener("click", async () => {
    const currentPage = parseInt(currentPageInput.value) || 0;
    const totalPages = parseInt(bookPagesElem.textContent) || 0;
    const shelf = shelfSelect.value;

    if (currentPage > totalPages) {
        alert("Current page cannot exceed total pages.");
        return;
    }

    const progress = {
        username,
        book: bookTitle,
        author: bookAuthor,       // <-- required for backend
        currentPage,
        totalPages,
        readingStatus: shelf
    };

    const res = await fetch("/api/home/editBookProgress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(progress)
    });

    if (res.ok) {
        alert("Progress saved!");
    } else {
        alert("Error saving progress.");
    }
});

// Run load
window.addEventListener("load", loadBook);
