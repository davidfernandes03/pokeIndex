export async function fetchPokemon(query) {
    if (typeof query !== "string") {
        query = String(query);
    }

    const url = `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Pokémon not found!");
        return await response.json();
    } catch (error) {
        console.error("Error fetching Pokémon:", error);
        return null;
    }
}

export async function fetchRandomPokemon(amount = 10) {
    const promises = [];
    for (let i = 0; i < amount; i++) {
        const randomId = Math.floor(Math.random() * 151) + 1;
        promises.push(fetchPokemon(randomId));
    }

    const results = await Promise.all(promises);
    return results.filter(pokemon => pokemon !== null);
}