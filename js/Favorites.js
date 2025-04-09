import { openPokemonModal } from "./Modal.js";
import { setupCarousel } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    displayFavorites(favorites);
});

function displayFavorites(pokemonList) {
    const container = document.getElementById("favorites-list");
    container.innerHTML = "";

    if (!pokemonList || pokemonList.length === 0) {
        container.innerHTML = "<p class='not-found'>No favorite Pokémon yet.</p>";
        return;
    }

    pokemonList.forEach(pokemon => {
        const { name, sprites, types } = pokemon;
        const imageUrl = sprites?.other?.["official-artwork"]?.front_default || "images/no-image.avif";
        const typeNames = types.map(t => t.type.name).join(", ");

        const card = document.createElement("div");
        card.classList.add("pokemon");
        card.innerHTML = `
            <img src="${imageUrl}" alt="${name}" loading="lazy">
            <h3>${name.charAt(0).toUpperCase() + name.slice(1)}</h3>
            <p><strong>Type:</strong> ${typeNames.toUpperCase()}</p>
            <button class="see-more">See more</button>
        `;

        card.querySelector("img").addEventListener("click", () => {
            openPokemonModal(pokemon, true);
        });
        card.querySelector(".see-more").addEventListener("click", () => {
            openPokemonModal(pokemon, true);
        });

        container.appendChild(card);
    });

    setupCarousel();
}