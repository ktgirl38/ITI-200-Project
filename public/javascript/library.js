var shelf=document.getElementById("shelf");

async function addToShelf(event){
    if(event.target && event.target.tagName === "A" && event.target.id.endsWith("Library")){
        const title=event.target.id.replace("Library", "");
        
        if(!username){
            alert("You must be signed in to add a book to your shelf");
            return;
        }

        const book = {
            username:localStorage.getItem("username"), 
            book: title,
            startingDate: Date.now(),
            readingStatus: "Currently Reading",
        
        };

        await fetch("/api/library/addToShelf", {
            headers: {
                'Accept':'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(book)
        });
    }
} 

shelf.addEventListener("click", addToShelf);