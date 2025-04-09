import { Pokemon } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const BATCH_SIZE = 20; // Number of Pokemon to fetch in each batch
const RATE_LIMIT_DELAY = 100; // Delay between requests in milliseconds

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

interface PokemonResponse {
  results: Array<{
    name: string;
    url: string;
  }>;
}

interface PokemonDetailsResponse {
  types: Array<{
    type: {
      name: string;
    };
  }>;
  height: number;
  weight: number;
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
}

interface PokemonSpeciesResponse {
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
  }>;
}

interface EvolutionChainResponse {
  chain: {
    species: {
      name: string;
      url: string;
    };
    evolves_to: Array<{
      species: {
        name: string;
        url: string;
      };
      evolution_details: Array<{
        min_level: number;
      }>;
      evolves_to: Array<any>;
    }>;
  };
}

const cache = new Map<string, CacheItem<any>>();

const getCachedData = <T>(key: string): T | null => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = <T>(key: string, data: T): void => {
  cache.set(key, { data, timestamp: Date.now() });
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithCache = async <T>(url: string): Promise<T> => {
  const cachedData = getCachedData<T>(url);
  if (cachedData) {
    return cachedData;
  }

  try {
    await delay(RATE_LIMIT_DELAY); // Add delay between requests
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setCachedData(url, data);
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

const processPokemonDetails = (details: PokemonDetailsResponse): Omit<Pokemon, 'id' | 'name'> => {
  return {
    types: details.types.map((type) => type.type.name),
    height: details.height,
    weight: details.weight,
    abilities: details.abilities.map((ability) => ability.ability.name),
    stats: {
      hp: details.stats.find((stat) => stat.stat.name === 'hp')?.base_stat || 0,
      attack: details.stats.find((stat) => stat.stat.name === 'attack')?.base_stat || 0,
      defense: details.stats.find((stat) => stat.stat.name === 'defense')?.base_stat || 0,
      specialAttack: details.stats.find((stat) => stat.stat.name === 'special-attack')?.base_stat || 0,
      specialDefense: details.stats.find((stat) => stat.stat.name === 'special-defense')?.base_stat || 0,
      speed: details.stats.find((stat) => stat.stat.name === 'speed')?.base_stat || 0,
    },
  };
};

export const pokemonApi = {
  async getAllPokemons(): Promise<Pokemon[]> {
    try {
      const response = await fetchWithCache<PokemonResponse>(`${BASE_URL}/pokemon/?limit=898`);
      const allPokemons: Pokemon[] = [];
      
      // Process Pokemon in batches
      for (let i = 0; i < response.results.length; i += BATCH_SIZE) {
        const batch = response.results.slice(i, i + BATCH_SIZE);
        const batchPokemons = await Promise.all(
          batch.map(async (pokemon, index) => {
            const id = i + index + 1;
            const details = await this.getPokemonDetails(id);
            return {
              id,
              name: pokemon.name,
              ...processPokemonDetails(details),
            };
          })
        );
        allPokemons.push(...batchPokemons);
        console.log(`Loaded Pokemon ${i + 1} to ${Math.min(i + BATCH_SIZE, response.results.length)}`);
      }
      
      return allPokemons;
    } catch (error) {
      console.error('Error fetching Pokemon list:', error);
      throw new Error('Failed to fetch Pokemon list');
    }
  },

  async getPokemonDetails(id: number): Promise<PokemonDetailsResponse> {
    return fetchWithCache<PokemonDetailsResponse>(`${BASE_URL}/pokemon/${id}`);
  },

  async getPokemonSpecies(id: number): Promise<PokemonSpeciesResponse> {
    return fetchWithCache<PokemonSpeciesResponse>(`${BASE_URL}/pokemon-species/${id}`);
  },

  async getEvolutionChain(id: number): Promise<EvolutionChainResponse> {
    return fetchWithCache<EvolutionChainResponse>(`${BASE_URL}/evolution-chain/${id}`);
  },
}; 