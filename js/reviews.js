document.addEventListener("DOMContentLoaded", () => {
    loadReviews();

    const reviewForm = document.getElementById("review-form");

    if (reviewForm) {
        reviewForm.addEventListener("submit", (event) => {
            event.preventDefault();
            saveReview();
        });
    } else {
        console.error("Not found!");
    }
});

function saveReview() {
    const title = document.getElementById("review-title").value.trim();
    const content = document.getElementById("review-content").value.trim();

    if (!title || !content) {
        alert("Please fill in both fields.");
        return;
    }

    const review = { title, content };
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    reviews.push(review);

    localStorage.setItem("reviews", JSON.stringify(reviews));

    document.getElementById("review-form").reset();
    loadReviews();
}

function loadReviews() {
    const reviewList = document.getElementById("review-card");

    reviewList.innerHTML = "";
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

    if (reviews.length === 0) {
        reviewList.innerHTML = "<p>No reviews yet.</p>";
        return;
    }

    reviews.forEach((review, index) => {
        const li = document.createElement("li");
        li.classList.add("card-reviews");
        li.innerHTML = `
            <div class="title-content">
                <strong class="edit-title">${review.title}</strong>
                <p class="edit-content">${review.content}</p>
            </div>
            <div class="buttons-container">
                <button class="edit-review" data-index="${index}">Edit</button>
                <button class="delete-review" data-index="${index}">Delete</button>
            </div>
        `;
        reviewList.appendChild(li);
    });

    document.querySelectorAll(".edit-review").forEach(button => {
        button.addEventListener("click", (event) => {
            editReview(event.target.dataset.index, event.target);
        });
    });

    document.querySelectorAll(".delete-review").forEach(button => {
        button.addEventListener("click", (event) => {
            deleteReview(event.target.dataset.index);
        });
    });
}

function editReview(index, button) {
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    
    const reviewCard = button.closest(".card-reviews");
    const titleField = reviewCard.querySelector(".edit-title");
    const contentField = reviewCard.querySelector(".edit-content");

    if (button.textContent === "Edit") {
        titleField.contentEditable = true;
        contentField.contentEditable = true;

        titleField.focus();

        button.textContent = "Save";
        button.classList.add("saving");
    } else {
        reviews[index].title = titleField.textContent.trim();
        reviews[index].content = contentField.textContent.trim();

        titleField.contentEditable = false;
        contentField.contentEditable = false;

        // Atualiza o localStorage
        localStorage.setItem("reviews", JSON.stringify(reviews));

        // Altera o botão de volta para "Edit"
        button.textContent = "Edit";
        button.classList.remove("saving");
    }
}

function deleteReview(index) {
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    reviews.splice(index, 1);
    localStorage.setItem("reviews", JSON.stringify(reviews));
    loadReviews();
}
