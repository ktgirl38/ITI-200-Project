

document.addEventListener("DOMContentLoaded", async () => {
  const btn = document.getElementById("submitComment");
  const input = document.getElementById("commentInput");
  const list = document.getElementById("commentList");

  const bookTitle = document.querySelector("h2").innerText.replace("Discussion: ", "");

  try {
    const res = await fetch(`/api/discussions/${encodeURIComponent(bookTitle)}`);
    if (res.ok) {
      const comments = await res.json();
      console.log(comments);
      list.innerHTML = comments
        .map(c => `<div class="alert alert-secondary mt-2"><b>${c.username}:</b> ${c.postcomment}</div>`)
        .join("");
    } else {
      list.innerHTML = `<p>No comments yet. Be the first!</p>`;
    }
  } catch (err) {
    console.error("Error fetching comments", err);
    list.innerHTML = `<p>Error loading comments.</p>`;
  }

  if (btn && input && list) {
    btn.addEventListener("click", async () => {
  const comment = input.value.trim();
  if (!comment) return;

  const username = localStorage.getItem("username");
  if (username===null) {
    alert("Guests can view comments but must log in to post.");
    return;
  }

  try {
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discussion: bookTitle, username, postComment: comment }),
    });

    if (res.ok) {
      const newComment = document.createElement("div");
      newComment.classList.add("alert", "alert-secondary", "mt-2");
      newComment.innerHTML = `<b>${username}:</b> ${comment}`;
      list.appendChild(newComment);
      input.value = "";
    } else {
      alert("Failed to post comment.");
    }
  } catch (err) {
    console.error("Error posting comment", err);
    alert("Server error while posting comment.");
  }
});
}
})