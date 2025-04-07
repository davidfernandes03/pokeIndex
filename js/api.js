const baseURL = "https://pokeapi.co/api/v2/";

export async function fetchPokemon(query) {
    if (typeof query !== "string") {
        query = String(query);
    }

    try {
        const response = await fetch(`${baseURL}pokemon/${query.toLowerCase()}`);
        if (!response.ok) throw new Error("Pokémon not found!");
        return await response.json();
    } catch (error) {
        console.error("Error fetching Pokémon:", error);
        return null;
    }
}

export async function fetchRandomPokemon(amount = 10) {
    const ids = Array.from({ length: 151 }, (_, i) => i + 1);
    
    for (let i = ids.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ids[i], ids[j]] = [ids[j], ids[i]];
    }

    const selectedIds = ids.slice(0, amount);
    const promises = selectedIds.map(id => fetchPokemon(id));

    const results = await Promise.all(promises);
    return results.filter(pokemon => pokemon !== null);
}

export async function fetchPokemonsByType(type) {
    try {
        const response = await fetch(`${baseURL}type/${type}`);
        const data = await response.json();

        const promises = data.pokemon.slice(0, 20).map(p => fetchPokemon(p.pokemon.name));

        const results = await Promise.all(promises);
        return results.filter(pokemon => pokemon !== null);
    } catch (error) {
        console.error("Error at finding a type:", error);
        return [];
    }
}

export async function fetchPokemonsByGeneration(generation) {
    try {
        const response = await fetch(`${baseURL}generation/${generation}`);
        const data = await response.json();

        const promises = data.pokemon_species.slice(0, 20).map(species => fetchPokemon(species.name));

        const results = await Promise.all(promises);
        return results.filter(pokemon => pokemon !== null);
    } catch (error) {
        console.error("Error at searching for a generation:", error);
        return [];
    }
}

export async function fetchPokemonSpecies(query) {
    if (typeof query !== "string") {
        query = String(query);
    }

    try {
        const response = await fetch(`${baseURL}pokemon-species/${query.toLowerCase()}`);
        if (!response.ok) throw new Error("Species not found!");
        return await response.json();
    } catch (error) {
        console.error("Error fetching species data:", error);
        return null;
    }
}

export async function fetchAllPokemonNames() {
    const response = await fetch(`${baseURL}pokemon?limit=100000&offset=0`);
    const data = await response.json();
    return data.results.map(p => p.name);
}