const username = localStorage.getItem("username"); // get logged-in user

async function loadLibrary() {
    try {
        const response = await fetch("/api/books");
        if (!response.ok) throw new Error("Network response not OK");
        
        const books = await response.json();

        if (!Array.isArray(books)) {
            console.error("Books is not an array:", books);
            return;
        }

        const libraryContainer = document.getElementById("libraryBooks");
        libraryContainer.innerHTML = "";

        books.forEach(book => {
            const col = document.createElement("div");
            col.className = "col-md-2";
            col.innerHTML = `
                <a href="book.html?title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author)}">
                    <img src="${book.cover}" class="img-fluid shelf-book" alt="${book.title}">
                </a>
            `;
            libraryContainer.appendChild(col);
        });
    } catch (err) {
        console.error("Failed to load library:", err);
    }
}


// Run on page load
window.addEventListener("load", loadLibrary);
