const container = document.getElementById("bookContainer");
const urlParams = new URLSearchParams(window.location.search);
const title = urlParams.get("title");
const author = urlParams.get("author");
const username = localStorage.getItem("username");
const response = await fetch(
    `/api/books/details?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&username=${encodeURIComponent(username)}`
);

async function loadBook() {
    const response = await fetch(`/api/books/details?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`);
    const book = await response.json();

    container.innerHTML = `
        <div class="card mb-3">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${book.cover}" class="img-fluid">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h3>${book.title}</h3>
                        <h5>${book.author}</h5>
                        <hr>
                        <label>Total Pages:</label>
                        <input type="number" id="totalPages" class="form-control mb-2" value="${book.pageNum || ''}">
                        
                        <label>Current Page:</label>
                        <input type="number" id="currentPage" class="form-control mb-2" value="0">

                        <label>Shelf:</label>
                        <select id="shelfSelect" class="form-control mb-2">
                            <option value="Currently Reading">Currently Reading</option>
                            <option value="Plan to Read">Plan to Read</option>
                            <option value="Completed">Completed</option>
                        </select>

                        <button id="saveBtn" class="btn btn-info mb-2">Save Progress</button>
                        <a href="discussion.html?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}" class="btn btn-primary">Go to Discussion</a>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById("saveBtn").addEventListener("click", saveProgress);
}

async function saveProgress() {
    const totalPages = document.getElementById("totalPages").value;
    const currentPage = document.getElementById("currentPage").value;
    const shelf = document.getElementById("shelfSelect").value;

    if (parseInt(currentPage) > parseInt(totalPages)) {
        alert("Current page cannot exceed total pages");
        return;
    }

    const progress = {
        username,
        book: title,
        author,
        currentPage,
        totalPages,
        readingStatus: shelf
    };

    await fetch("/api/home/editBookProgress", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(progress)
    });

    alert("Progress saved!");
}

window.addEventListener("load", loadBook);
