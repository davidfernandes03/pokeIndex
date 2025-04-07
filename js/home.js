import { fetchRandomPokemon, fetchAllPokemonNames } from "./api.js";
import { setupCarousel, getSuggestions } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
    fetchRandomPokemon(10).then(displayPokemon);
    setupSearch();
});

function displayPokemon(pokemonList) {
    const pokemonContainer = document.getElementById("pokemon-list");
    pokemonContainer.innerHTML = "";

    pokemonList.forEach(pokemon => {
        const { name, sprites, types } = pokemon;
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

function setupSearch() {
    const input = document.querySelector(".search-input");
    const button = document.querySelector(".search-btn");

    function handleSearch() {
        const query = input.value.trim();
        if (query) {
            window.location.href = `pokemon.html?search=${encodeURIComponent(query)}`;
        }
    }

    button.addEventListener("click", handleSearch);
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    });
}

function setupAutocomplete(input) {
    let allNames = [];

    fetchAllPokemonNames().then(names => {
        allNames = names;
    });

    input.addEventListener("input", () => {
        const suggestions = getSuggestions(input.value, allNames);
        showSuggestionsDropdown(suggestions, input);
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".autocomplete-dropdown") && !e.target.classList.contains("search-input")) {
            removeSuggestionsDropdown();
        }
    });
}

function showSuggestionsDropdown(suggestions, inputElement) {
    removeSuggestionsDropdown();

    if (suggestions.length === 0) return;

    const dropdown = document.createElement("ul");
    dropdown.classList.add("autocomplete-dropdown");

    suggestions.forEach(name => {
        const item = document.createElement("li");
        item.classList.add("suggestion-item");
        item.textContent = name;

        item.addEventListener("click", () => {
            inputElement.value = name;
            removeSuggestionsDropdown();
        });

        dropdown.appendChild(item);
    });

    inputElement.parentNode.appendChild(dropdown);
}

function removeSuggestionsDropdown() {
    const existing = document.querySelector(".autocomplete-dropdown");
    if (existing) existing.remove();
}

const inputAuto = document.querySelector(".search-input");
if (inputAuto) setupAutocomplete(inputAuto);
