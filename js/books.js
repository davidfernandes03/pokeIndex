import { fetchBooks } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {});


function displayBooks(books) {
    const bookContainer = document.getElementById("books-container");
    bookContainer.innerHTML = "";

    books.forEach(book => {
        const { title, authors, imageLinks, description, infoLink } = book.volumeInfo;
        const bookItem = document.createElement("div");
        bookItem.classList.add("book");

        bookItem.innerHTML = `
            <img src="${imageLinks?.thumbnail || 'images/no-image.avif'}" alt="${title}" class="book-img" loading="lazy">
            <h3>${title}</h3>
            <p>${authors ? authors.join(", ") : "Unknown Author"}</p>
            <button class="books-btn" data-title="${title}" data-desc="${description}" data-link="${infoLink}">See more</button>
        `;

        bookContainer.appendChild(bookItem);
    });

    setupCarousel();
    setupModal();
}

function setupCarousel() {
    const container = document.querySelector(".carousel-container");
    document.getElementById("prevBtn").addEventListener("click", () => {
        container.scrollLeft -= 300;
    });
    document.getElementById("nextBtn").addEventListener("click", () => {
        container.scrollLeft += 300;
    });
}

function setupModal() {
    const modal = document.getElementById("book-modal-books");
    const modalTitle = document.getElementById("modal-title-books");
    const modalDescription = document.getElementById("modal-description-books");
    const modalLink = document.getElementById("modal-link-books");
    const closeModal = document.querySelector(".close-modal");

    document.querySelectorAll(".books-btn").forEach(button => {
        button.addEventListener("click", (event) => {
            modalTitle.textContent = event.target.dataset.title;
            modalDescription.textContent = event.target.dataset.desc || "No Description Available";
            modalLink.href = event.target.dataset.link;

            modal.showModal();
        });
    });

    closeModal.addEventListener("click", () => {
        modal.close();
    });
}

document.getElementById("search-btn-books").addEventListener("click", () => {
    const query = document.getElementById("search-input-books").value;
    if (query) {
        fetchBooks(query, 20).then(displayBooks);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get("search");

    if (searchQuery) {
        fetchBooks(searchQuery, 20).then(displayBooks);
        document.getElementById("search-input-books").value = searchQuery;
    }
});
