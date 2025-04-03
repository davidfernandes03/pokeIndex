import { fetchPokemon, fetchRandomPokemon } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
    fetchRandomPokemon(10).then(displayPokemon)
});

function displayPokemon(pokemonList) {
    const pokemonContainer = document.getElementById("pokemon-list");
    pokemonContainer.innerHTML = "";

    pokemonList.forEach(pokemon => {
        const { name, id, sprites, types } = pokemon;
        const imageUrl = sprites.other["official-artwork"].front_default || "images/no-image.avif";
        const typeNames = types.map(t => t.type.name).join(", ");

        const pokemonItem = document.createElement("div");
        pokemonItem.classList.add("pokemon");

        pokemonItem.innerHTML = `
            <img src="${imageUrl}" alt="${name}" loading="lazy">
            <h3>${name.charAt(0).toUpperCase() + name.slice(1)}</h3>
            <p style="margin-bottom: 5px;"><strong>Type:</strong></p>
            <p style="margin: 5px 0;">${typeNames.toUpperCase()}</p>
        `;

        pokemonContainer.appendChild(pokemonItem);
    });

    setupCarousel();
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

document.getElementById("search-btn").addEventListener("click", () => {
    const query = document.getElementById("search-input").value.trim();
    if (query) {
        window.location.href = `pokemon.html?search=${encodeURIComponent(query)}`;
    }
});
