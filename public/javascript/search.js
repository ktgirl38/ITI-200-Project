const query = document.getElementById("navSearch");
const form = document.getElementById("navbarSearch");

async function search(event) {
    event.preventDefault();
    if(!(query.value === "")){
        window.location.href="search.html?title=" + encodeURIComponent(query.value);

    } else {
        alert("Search bar is empty, please enter a book title to search for");
    }
}

form.addEventListener("submit", search)
