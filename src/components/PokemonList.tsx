import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pokemon } from '../types/pokemon';
import { RootState } from '../store';
import { setPokemons, setCurrentPokemon, setError } from '../store/pokemonSlice';
import { pokemonApi } from '../services/pokemonApi';
import { typeColors } from '../constants/pokemon';

export const PokemonList: React.FC = () => {
  const dispatch = useDispatch();
  const pokemons = useSelector((state: RootState) => state.pokemon.pokemons);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPokemons = async () => {
      try {
        const data = await pokemonApi.getAllPokemons();
        dispatch(setPokemons(data));
      } catch (error) {
        setError('Failed to load Pokemon list');
        console.error('Error loading Pokemon list:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPokemons();
  }, [dispatch]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handlePokemonClick = (pokemon: Pokemon) => {
    dispatch(setCurrentPokemon(pokemon));
  };

  const filteredPokemons = pokemons.filter((pokemon: Pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm) ||
    pokemon.id.toString().includes(searchTerm)
  );

  if (loading) {
    return (
      <div id="loading-div">
        <img src="/pokeball-icon.png" className="loading-ball" alt="Loading" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <>
      {/* Pokedex Heading */}
      <div className="pokedex-heading">
        <h1>Pokedex</h1>
      </div>

      {/* Search Bar */}
      <div id="search-bar-container" className="row container margin-40">
        <input
          id="search-input"
          className="search-input"
          placeholder="Search your Pokemon"
          value={searchTerm}
          onChange={handleSearch}
        />
        <div id="start-search-button" className="center">
          <i className="fas fa-search"></i>
        </div>
      </div>

      <div id="pokedex-list-render-container">
        {filteredPokemons.map((pokemon: Pokemon) => (
          <div
            key={pokemon.id}
            className="pokemon-render-result-container container center column"
            onClick={() => handlePokemonClick(pokemon)}
          >
            <img
              className="search-pokemon-image"
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
              alt={pokemon.name}
            />
            <span className="bold font-size-12">N° {pokemon.id}</span>
            <h3>{pokemon.name}</h3>
            <div className="row">
              {pokemon.types.map((type: string) => (
                <div
                  key={type}
                  className="type-container"
                  style={{ background: typeColors[type.toLowerCase()] }}
                >
                  {type}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}; 