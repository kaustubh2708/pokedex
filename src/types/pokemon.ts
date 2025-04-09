export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  height: number;
  weight: number;
  abilities: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  description?: string;
  evolutionChain?: Array<{
    id: number;
    name: string;
    level?: number;
  }>;
}

export interface PokemonState {
  pokemons: Pokemon[];
  currentPokemon: Pokemon | null;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  favorites: number[];
  filters: {
    types: string[];
    sortBy: 'name' | 'number' | 'type';
  };
}

export type PokemonAction =
  | { type: 'SET_POKEMONS'; payload: Pokemon[] }
  | { type: 'SET_CURRENT_POKEMON'; payload: Pokemon }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'TOGGLE_FAVORITE'; payload: number }
  | { type: 'SET_FILTERS'; payload: PokemonState['filters'] }; 