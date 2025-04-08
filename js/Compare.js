import { fetchPokemon, fetchPokemonSpecies } from "./api.js";
import { capitalize, normalizeSpeciesName, setupAutocomplete } from "./utils.js";

let pokemonData1 = null;
let pokemonData2 = null;

// Compare Button
const compareBtn = document.getElementById("start-compare-btn");
compareBtn.disabled = true;
updateCompareButton();

function updateCompareButton() {
    const validData = pokemonData1 && pokemonData2;
    const different = validData && pokemonData1.name !== pokemonData2.name;

    compareBtn.disabled = !different;

    if (compareBtn.disabled) {
        compareBtn.classList.add("disabled");
    } else {
        compareBtn.classList.remove("disabled");
    }
}

// Search Button
const inputs = document.querySelectorAll(".search-input");
const buttons = document.querySelectorAll(".search-btn");

buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
        handleSearch(index);
    });
});

inputs.forEach((input, index) => {
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            handleSearch(index);
        }
    });
});

function handleSearch(index) {
    const input = inputs[index];
    const query = input.value.trim().toLowerCase();

    if (!query) return;

    fetchPokemon(query).then(pokemon => {
        const container = document.getElementById(`pokemon-display-${index + 1}`);

        if (!pokemon) {
            container.innerHTML = "<p class='not-found'>No Pokémon found.</p>";
            if (index === 0) pokemonData1 = null;
            else pokemonData2 = null;

            updateCompareButton();
            return;
        }

        fetchPokemonSpecies(pokemon.id).then(species => {
            const fullData = { ...pokemon, species };
            if (index === 0) {
                pokemonData1 = fullData;
                renderPokemon(pokemonData1, 1);
            } else {
                pokemonData2 = fullData;
                renderPokemon(pokemonData2, 2);
            }

            updateCompareButton();
        });
    });
}

document.getElementById("start-compare-btn").addEventListener("click", () => {
    if (!pokemonData1 || !pokemonData2) return;

    highlightComparison(pokemonData1.stats, pokemonData2.stats);
});

async function renderPokemon(pokemon, slot) {
    const pokemonContainer = document.getElementById(`pokemon-display-${slot}`);
    pokemonContainer.innerHTML = "";

    const { name, sprites, types } = pokemon;
    const normalizedName = normalizeSpeciesName(name);
    const species = await fetchPokemonSpecies(normalizedName);

    const imageUrl = sprites.other["official-artwork"].front_default || "images/no-image.avif";
    const typeNames = types.map(t => t.type.name).join(", ");
    const rarity = species
        ? species.is_legendary
            ? "Legendary"
            : species.is_mythical
            ? "Mythic"
            : "Regular"
        : "Unknown";
    
    const statsHTML = pokemon.stats.map(stat => `
        <li data-stat="${stat.base_stat}">
            <strong>${capitalize(stat.stat.name)}:</strong> ${stat.base_stat}
        </li>
    `).join("");

    const pokemonItem = document.createElement("div");
    pokemonItem.classList.add("pokemon", "single-result");

    pokemonItem.innerHTML = `
        <img src="${imageUrl}" alt="${name}" loading="lazy">
        <h3>${name.charAt(0).toUpperCase() + name.slice(1)}</h3>
        <p><strong>Type:</strong> ${typeNames.toUpperCase()}</p>
        <p><strong>Rarity:</strong> ${rarity}</p>
        <ul class="stat-list">${statsHTML}</ul>
    `;

    pokemonContainer.appendChild(pokemonItem);
} 

function highlightComparison(stats1, stats2) {
    const list1 = document.querySelectorAll("#pokemon-display-1 .stat-list li");
    const list2 = document.querySelectorAll("#pokemon-display-2 .stat-list li");

    stats1.forEach((stat, i) => {
        const val1 = stat.base_stat;
        const val2 = stats2[i].base_stat;

        list1[i].className = "";
        list2[i].className = "";

        if (val1 > val2) {
            list1[i].classList.add("stat-higher");
            list2[i].classList.add("stat-lower");
        } else if (val1 < val2) {
            list1[i].classList.add("stat-lower");
            list2[i].classList.add("stat-higher");
        } else {
            list1[i].classList.add("stat-equal");
            list2[i].classList.add("stat-equal");
        }
    });
}

// Autocomplete
document.addEventListener("DOMContentLoaded", () => {
    const inputs = document.querySelectorAll(".search-input");
    inputs.forEach(input => setupAutocomplete(input));
});