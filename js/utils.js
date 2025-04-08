import { fetchAllPokemonNames } from "./api.js";

export function capitalize(str) {
    return str.split(", ").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(", ");
}

export function setupCarousel() {
    const container = document.querySelector(".carousel-container");
    document.getElementById("prevBtn").addEventListener("click", () => {
        container.scrollLeft -= 300;
    });
    document.getElementById("nextBtn").addEventListener("click", () => {
        container.scrollLeft += 300;
    });
}

export function getSuggestions(query, names, limit = 5) {
    if (!query) return [];
    return names
        .filter(name => name.toLowerCase().startsWith(query.toLowerCase()))
        .slice(0, limit);
}

export function normalizeSpeciesName(name) {
    return name
        .replace(/-mega(-[xy])?/, "")
        .replace(/-gmax/, "")
        .replace(/-alola|-galar|-hisui|-paldea/, "")
        .replace(/-.*$/, "");
}

export function setupAutocomplete(inputOrInputs) {
    const inputs = inputOrInputs instanceof NodeList || Array.isArray(inputOrInputs)
        ? inputOrInputs
        : [inputOrInputs];

    let allNames = [];

    fetchAllPokemonNames().then(names => {
        allNames = names;
    });

    inputs.forEach(input => {
        input.addEventListener("input", () => {
            const suggestions = getSuggestions(input.value, allNames);
            showSuggestionsDropdown(suggestions, input);
        });
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
