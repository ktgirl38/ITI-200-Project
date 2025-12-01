const libraryDiv = document.getElementById("libraryBooks");

async function loadLibrary() {
    const response = await fetch("/api/books"); 
    const books = await response.json();

    for (let book of books) {
        const card = document.createElement("div");
        card.className = "col-md-3";

        card.innerHTML = `
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

        libraryDiv.appendChild(card);
    }
}

window.addEventListener("load", loadLibrary);
