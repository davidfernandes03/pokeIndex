import { fetchPokemonSpecies } from "./api.js";
import { capitalize } from "./utils.js";

export async function openPokemonModal(pokemon) {
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

    const speciesData = await fetchPokemonSpecies(pokemon.species.name);

    const getFlavorText = () => {
        const entry = speciesData?.flavor_text_entries.find(e => e.language.name === "en");
        return entry ? entry.flavor_text.replace(/\f|\n/g, " ") : "No description available.";
    };

    modalImage.src = pokemon.sprites.other["official-artwork"].front_default || "images/no-image.avif";

    modalTitle.textContent = capitalize(pokemon.name);

    modalTypes.innerHTML = `<strong>Types:</strong> ${pokemon.types.map(t => t.type.name).join(", ").toUpperCase()}`;

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

    modal.showModal();
    document.querySelector(".close-modal").addEventListener("click", () => {
        modal.close();
    });
}