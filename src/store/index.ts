 import { configureStore } from '@reduxjs/toolkit';
import pokemonReducer from './pokemonSlice';
import { PokemonState } from '../types/pokemon';

export interface RootState {
  pokemon: PokemonState;
}

export const store = configureStore({
  reducer: {
    pokemon: pokemonReducer,
  },
});

export type AppDispatch = typeof store.dispatch; 