import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { toggleFavorite } from '../store/pokemonSlice';
import { Pokemon } from '../types/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: () => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onClick }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.pokemon.favorites);

  const isFavorite = favorites.includes(pokemon.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(pokemon.id));
  };

  return (
    <div 
      className="pokemon-card" 
      role="button"
      onClick={onClick}
      onKeyPress={(e) => e.key === 'Enter' && onClick()}
      tabIndex={0}
      aria-label={`${pokemon.name} Pokemon card`}
    >
      <img
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
        alt={`${pokemon.name} sprite`}
        className="pokemon-sprite"
      />
      <h3 className="pokemon-name">{pokemon.name}</h3>
      <div className="pokemon-types">
        {pokemon.types.map((type) => (
          <span key={type} className={`type-badge ${type}`}>
            {type}
          </span>
        ))}
      </div>
      <button
        className={`favorite-button ${isFavorite ? 'favorite' : ''}`}
        onClick={handleFavoriteClick}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorite ? '★' : '☆'}
      </button>
    </div>
  );
}; 