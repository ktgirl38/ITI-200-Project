const username = localStorage.getItem("username"); // get logged-in user

async function loadLibrary() {
    const container = document.getElementById("libraryBooks");

    // Fetch all books from the server
    const response = await fetch("/api/books");
    const books = await response.json();

    container.innerHTML = ""; // clear container

    books.forEach(book => {
        const col = document.createElement("div");
        col.className = "col-md-3";

        // Each book links to its individual page
        col.innerHTML = `
            <div class="card h-100">
                <a href="book.html?title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author)}">
                    <img src="${book.cover}" class="card-img-top" alt="${book.title}">
                </a>
                <div class="card-body blueBG center">
                    <h5 class="card-title">${book.title}</h5>
                    <p class="card-text">${book.author}</p>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

// Run on page load
window.addEventListener("load", loadLibrary);
