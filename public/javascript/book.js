const username = localStorage.getItem("username");
if (!username) {
    alert("Please log in to track your books.");
    window.location.href = "login.html";
}

// Get book title from URL
const params = new URLSearchParams(window.location.search);
const bookTitle = params.get("title");

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

// Load book info from server
async function loadBook() {
    const response = await fetch(`/api/books/${encodeURIComponent(bookTitle)}`);
    const book = await response.json();

    bookCover.src = book.cover;
    bookTitleElem.textContent = book.title;
    bookAuthorElem.textContent = book.author;
    bookISBNElem.textContent = book.ISBN || "N/A";
    bookPublisherElem.textContent = book.publisher || "N/A";
    bookPagesElem.textContent = book.pageNum || "Unknown";

    // Set discussion link
    discussionLink.href = `discussions/${book.title.replace(/\s/g, '')}.html`;

    // Load user's current progress if exists
    const progressRes = await fetch(`/api/readingstats/${encodeURIComponent(username)}`);
    const stats = await progressRes.json();
    const userBook = stats.find(b => b.book === book.title);

    if (userBook) {
        currentPageInput.value = userBook.currentpage || 0;
        shelfSelect.value = userBook.readingstatus;
    }
}

// Save or update progress
saveBtn.addEventListener("click", async () => {
    const currentPage = parseInt(currentPageInput.value) || 0;
    const shelf = shelfSelect.value;
    const totalPages = parseInt(bookPagesElem.textContent) || 0;

    if (currentPage > totalPages) {
        alert("Current page cannot exceed total pages.");
        return;
    }

    const progress = {
        username,
        book: bookTitle,
        currentPage,
        totalPages,
        readingStatus: shelf
    };

    const res = await fetch("/api/home/editBookProgress", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progress)
    });

    if (res.ok) {
        alert("Progress saved successfully!");
    } else {
        alert("Error saving progress.");
    }
});

window.addEventListener("load", loadBook);
