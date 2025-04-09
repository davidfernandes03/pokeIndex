import { fetchPokemonSpecies } from "./api.js";
import { capitalize } from "./utils.js";

function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}
function saveFavorites(favs) {
    localStorage.setItem("favorites", JSON.stringify(favs));
}
function isFavorited(id) {
    return getFavorites().some(p => p.id === id);
}
function addFavorite(pokemon) {
    const favs = getFavorites();
    if (!isFavorited(pokemon.id)) {
        favs.push(pokemon);
        saveFavorites(favs);
    }
}
function removeFavorite(id) {
    const favs = getFavorites().filter(p => p.id !== id);
    saveFavorites(favs);
}

export async function openPokemonModal(pokemon, showUnfavorite = false) {
    const modal = document.getElementById("pokemon-modal");
    const modalImage = document.getElementById("modal-image");
    const modalTitle = document.getElementById("modal-title");
    const modalTypes = document.getElementById("modal-types");
    const modalAbilities = document.getElementById("modal-abilities");
    const modalHeightWeight = document.getElementById("modal-height-weight");
    const modalStats = document.getElementById("modal-stats");
    const modalGeneration = document.getElementById("modal-generation");
    const modalHabitat = document.getElementById("modal-habitat");
    const modalLegendary = document.getElementById("modal-legendary");
    const modalDescription = document.getElementById("modal-description");
    const favoriteBtn = document.getElementById("favorite-btn");

    const speciesData = await fetchPokemonSpecies(pokemon.species.name);

    const getFlavorText = () => {
        const entry = speciesData?.flavor_text_entries.find(e => e.language.name === "en");
        return entry ? entry.flavor_text.replace(/\f|\n/g, " ") : "No description available.";
    };

    // Modal Items
    modalImage.src = pokemon.sprites.other["official-artwork"].front_default || "images/no-image.avif";
    modalTitle.textContent = capitalize(pokemon.name);
    modalTypes.innerHTML = `<strong>Type:</strong> ${pokemon.types.map(t => t.type.name).join(", ").toUpperCase()}`;
    modalHeightWeight.innerHTML = `<strong>Height:</strong> ${pokemon.height / 10} m &nbsp;&nbsp; <strong>Weight:</strong> ${pokemon.weight / 10} kg`;
    modalGeneration.innerHTML = `<strong>Generation:</strong> ${capitalize(speciesData?.generation?.name || "Unknown")}`;
    modalHabitat.innerHTML = `<strong>Habitat:</strong> ${capitalize(speciesData?.habitat?.name || "Unknown")}`;

    modalLegendary.innerHTML = speciesData?.is_legendary
        ? `<strong>Rarity:</strong> Legendary`
        : speciesData?.is_mythical
            ? `<strong>Rarity:</strong> Mythic`
            : `<strong>Rarity:</strong> Regular`;

    modalAbilities.innerHTML = `<strong>Abilities:</strong> ${pokemon.abilities.map(a => capitalize(a.ability.name)).join(", ")}`;

    modalStats.innerHTML = `
        <h3><strong>Stats:</strong></h3>
        <ul>
            ${pokemon.stats.map(stat => `<li>${capitalize(stat.stat.name)}: <strong>${stat.base_stat}</strong></li>`).join("")}
        </ul>
    `;
    modalDescription.textContent = getFlavorText();

    // Favorite Display
    const isFav = isFavorited(pokemon.id);
    favoriteBtn.textContent = showUnfavorite || isFav
        ? "💔 Remove from Favorites"
        : "❤️ Add to Favorites";

    if (isFav) {
        favoriteBtn.classList.remove("fav-btn-add");
        favoriteBtn.classList.add("fav-btn-remove");
    } else {
        favoriteBtn.classList.remove("fav-btn-remove");
        favoriteBtn.classList.add("fav-btn-add");
    }
    
    favoriteBtn.onclick = () => {
        if (isFavorited(pokemon.id)) {
            removeFavorite(pokemon.id);
            favoriteBtn.textContent = "❤️ Add to Favorites";
            favoriteBtn.classList.remove("fav-btn-remove");
            favoriteBtn.classList.add("fav-btn-add");
        } else {
            addFavorite(pokemon);
            favoriteBtn.textContent = "💔 Remove from Favorites";
            favoriteBtn.classList.remove("fav-btn-add");
            favoriteBtn.classList.add("fav-btn-remove");
        }
    };

    document.querySelector(".close-modal").addEventListener("click", () => {
        modal.close();
    });
    modal.showModal();
}