// shelf.js
const username = localStorage.getItem("username"); // get logged-in user

async function loadShelf() {
    if (!username) return; // if not logged in, stop

    const response = await fetch(`/api/readingstats/${encodeURIComponent(username)}`);
    const data = await response.json();

    const currentlyReadingContainer = document.getElementById("currentlyReadingBooks");
    const finishedContainer = document.getElementById("finishedBooks");
    const planToReadContainer = document.getElementById("planToReadBooks");

    // Clear containers
    currentlyReadingContainer.innerHTML = "";
    finishedContainer.innerHTML = "";
    planToReadContainer.innerHTML = "";

    data.forEach(book => {
        const col = document.createElement("div");
        col.className = "col-md-2";

        col.innerHTML = `
            <img src="${book.cover}" class="img-fluid shelf-book" alt="${book.title}">
            <div class="progress mt-1">
              <div class="progress-bar" role="progressbar" style="width: ${Math.round((book.currentpage/book.pagenum)*100)}%;" aria-valuenow="${Math.round((book.currentpage/book.pagenum)*100)}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        `;

        if (book.readingstatus === "Currently Reading") {
            currentlyReadingContainer.appendChild(col);
        } else if (book.readingstatus === "Completed") {
            finishedContainer.appendChild(col);
        } else if (book.readingstatus === "TBR") {
            planToReadContainer.appendChild(col);
        }
    });
}

window.addEventListener("load", loadShelf);
