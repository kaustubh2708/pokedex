import React from 'react';
import { PokemonList } from './components/PokemonList';
import { PokemonDetails } from './components/PokemonDetails';

export const App: React.FC = () => {
  return (
    <div className="row">
      {/* Setup Loading Div */}
      <div id="loading-div">
        <img src="src/pokeball-icon.png" className="loading-ball" alt="Loading" />
      </div>

      {/* Search Bar and render search pokemon */}
      <div id="pokedex-list" className="column">
        <PokemonList />
      </div>
      
      {/* Responsive current pokemon */}
      <div id="current-pokemon-responsive-background" className="hide"></div>
      <div id="current-pokemon-responsive-close" className="hide">
        <img src="src/close-icon.png" alt="Close" />
      </div>

      {/* Current selected pokemon */}
      <div id="current-pokemon-container" className="container column center">
        <img id="current-pokemon-image" src="src/no-pokemon-selected-image.png" alt="No Pokemon Selected" />
        <PokemonDetails />
      </div>

      {/* Back to top button */}
      <div id="back-to-top-button" className="hide">
        <img src="src/arrow-up-icon.png" alt="Back to top" />
      </div>

      {/* Loading selected pokemon */}
      <img id="current-pokemon-loading" src="src/pokeball-icon.png" className="loading-ball" alt="Loading" />
    </div>
  );
}; 