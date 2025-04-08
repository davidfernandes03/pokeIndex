import { openPokemonModal } from "./Modal.js";
import { setupCarousel, setupAutocomplete } from "./utils.js";
import { fetchPokemon, fetchRandomPokemon, fetchPokemonsByType, fetchPokemonsByGeneration } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get("search");

    if (searchQuery) {
        document.querySelector(".search-input").value = searchQuery;
        fetchPokemon(searchQuery.toLowerCase()).then(pokemon => {
            const result = pokemon ? [pokemon] : [];
            displayPokemon(result);
        });
    } else {
        fetchRandomPokemon(10).then(displayPokemon);
    }

    setupFilters();
    setupSearch();
});

function displayPokemon(pokemonList) {
    const pokemonContainer = document.getElementById("pokemon-list");
    pokemonContainer.innerHTML = "";

    if (!pokemonList || pokemonList.length === 0) {
        pokemonContainer.innerHTML = "<p class='not-found'>No Pokémon found.</p>";
        return;
    }

    const isSingle = pokemonList.length === 1;

    pokemonList.forEach(pokemon => {
        const { name, sprites, types } = pokemon;
        const imageUrl = sprites.other["official-artwork"].front_default || "images/no-image.avif";
        const typeNames = types.map(t => t.type.name).join(", ");

        const pokemonItem = document.createElement("div");
        pokemonItem.classList.add("pokemon");

        if (isSingle) {
            pokemonItem.classList.add("single-result");
        }

        pokemonItem.innerHTML = `
            <img src="${imageUrl}" alt="${name}" loading="lazy">
            <h3>${name.charAt(0).toUpperCase() + name.slice(1)}</h3>
            <p style="margin-bottom: 5px;"><strong>Type:</strong></p>
            <p style="margin: 5px 0;">${typeNames.toUpperCase()}</p>
            <button class="see-more">See more</button>
        `;

        pokemonItem.querySelector("img").addEventListener("click", () => {
            openPokemonModal(pokemon);
        });
        pokemonItem.querySelector(".see-more").addEventListener("click", () => {
            openPokemonModal(pokemon);
        });

        pokemonContainer.appendChild(pokemonItem);
    });

    setupCarousel();
}

function setupFilters() {
    document.getElementById("filter-type").addEventListener("change", async (e) => {
        const type = e.target.value;
        if (!type) return;

        const pokemons = await fetchPokemonsByType(type);
        displayPokemon(pokemons);
    });

    document.getElementById("filter-generation").addEventListener("change", async (e) => {
        const generation = e.target.value;
        if (!generation) return;

        const pokemons = await fetchPokemonsByGeneration(generation);
        displayPokemon(pokemons);
    });
}

function setupSearch() {
    const input = document.querySelector(".search-input");
    const button = document.querySelector(".search-btn");

    function handleSearch() {
        const query = input.value.trim();
        if (query) {
            fetchPokemon(query.toLowerCase()).then(pokemon => {
                if (pokemon) {
                    displayPokemon([pokemon]);
                } else {
                    displayPokemon([]);
                }
            });
        }
    }

    button.addEventListener("click", handleSearch);
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    });
}

// Autocomplete
const inputAuto = document.querySelector(".search-input");
if (inputAuto) setupAutocomplete(inputAuto);