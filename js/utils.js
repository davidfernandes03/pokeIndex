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