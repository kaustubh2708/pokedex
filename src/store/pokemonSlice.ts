import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Pokemon, PokemonState } from '../types/pokemon';

const initialState: PokemonState = {
  pokemons: [],
  currentPokemon: null,
  loading: false,
  error: null,
  searchTerm: '',
  favorites: [],
  filters: {
    types: [],
    sortBy: 'number',
  },
};

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    setPokemons: (state, action: PayloadAction<Pokemon[]>) => {
      state.pokemons = action.payload;
    },
    setCurrentPokemon: (state, action: PayloadAction<Pokemon>) => {
      state.currentPokemon = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const index = state.favorites.indexOf(action.payload);
      if (index === -1) {
        state.favorites.push(action.payload);
      } else {
        state.favorites.splice(index, 1);
      }
    },
    setFilters: (state, action: PayloadAction<PokemonState['filters']>) => {
      state.filters = action.payload;
    },
  },
});

export const {
  setPokemons,
  setCurrentPokemon,
  setLoading,
  setError,
  setSearchTerm,
  toggleFavorite,
  setFilters,
} = pokemonSlice.actions;

export default pokemonSlice.reducer; 