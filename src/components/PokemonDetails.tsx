import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Pokemon } from '../types/pokemon';
import { RootState } from '../store';
import { pokemonApi } from '../services/pokemonApi';
import { typeColors } from '../constants/pokemon';

interface EvolutionChain {
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
}

interface EvolutionChainResponse {
  chain: EvolutionChain;
}

export const PokemonDetails: React.FC = () => {
  const currentPokemon = useSelector((state: RootState) => state.pokemon.currentPokemon);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<Pokemon | null>(null);

  useEffect(() => {
    const loadPokemonDetails = async () => {
      if (!currentPokemon) return;

      setLoading(true);
      setError(null);

      try {
        const [species, evolutionChain] = await Promise.all([
          pokemonApi.getPokemonSpecies(currentPokemon.id),
          pokemonApi.getEvolutionChain(currentPokemon.id),
        ]);

        const description = species.flavor_text_entries.find(
          (entry: { language: { name: string } }) => entry.language.name === 'en'
        )?.flavor_text;

        const evolutionData = evolutionChain.chain;
        const evolutionChainData = [];
        let currentEvolution = evolutionData;

        while (currentEvolution) {
          const id = parseInt(
            currentEvolution.species.url.split('/').slice(-2, -1)[0]
          );
          const nextEvolution = currentEvolution.evolves_to[0];
          evolutionChainData.push({
            id,
            name: currentEvolution.species.name,
            level: nextEvolution?.evolution_details[0]?.min_level,
          });
          currentEvolution = nextEvolution;
        }

        setDetails({
          ...currentPokemon,
          description,
          evolutionChain: evolutionChainData,
        });
      } catch (error) {
        setError('Failed to load Pokemon details');
        console.error('Error loading Pokemon details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPokemonDetails();
  }, [currentPokemon]);

  if (!currentPokemon) {
    return (
      <div id="current-pokemon-empty">
        <span className="font-size-18">Select a Pokemon<br />to display here.</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div id="current-pokemon-loading">
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
    <div id="current-pokemon-info">
      {/* Id */}
      <span id="current-pokemon-id" className="font-size-12 bold">
        #{currentPokemon.id.toString().padStart(3, '0')}
      </span>
      
      {/* Name */}
      <h2 id="current-pokemon-name">{currentPokemon.name}</h2>

      {/* Types */}
      <div id="current-pokemon-types" className="row center">
        {currentPokemon.types.map((type: string) => (
          <div
            key={type}
            className="type-container"
            style={{ background: typeColors[type.toLowerCase()] }}
          >
            {type}
          </div>
        ))}
      </div>

      {/* Description */}
      <h4>Pokedex Entry</h4>
      <span id="current-pokemon-description">{details?.description}</span>

      {/* Height and Weight */}
      <div className="row center">
        <div className="width-100 column center margin-5">
          <h4>Height</h4>
          <div id="current-pokemon-height" className="pokemon-info-variable-container">
            {currentPokemon.height / 10}m
          </div>
        </div>
        <div className="width-100 column center margin-5">
          <h4>Weight</h4>
          <div id="current-pokemon-weight" className="pokemon-info-variable-container">
            {currentPokemon.weight / 10}kg
          </div>
        </div>
      </div>

      {/* Abilities */}
      <div className="column">
        <h4>Abilities</h4>
        <div className="row">
          {currentPokemon.abilities.map((ability, index) => (
            <div key={ability} id={`current-pokemon-abilitiy-${index}`} className="pokemon-info-variable-container">
              {ability}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <h4>Stats</h4>
      <div className="row center">
        <div className="current-pokemon-stats-container column">
          <div className="current-pokemon-stats-name" style={{ background: '#DF2140' }}>
            HP
          </div>
          <h5 id="current-pokemon-stats-hp">{currentPokemon.stats.hp}</h5>
        </div>
        <div className="current-pokemon-stats-container column">
          <div className="current-pokemon-stats-name" style={{ background: '#FF994D' }}>
            ATK
          </div>
          <h5 id="current-pokemon-stats-atk">{currentPokemon.stats.attack}</h5>
        </div>
        <div className="current-pokemon-stats-container column">
          <div className="current-pokemon-stats-name" style={{ background: '#eecd3d' }}>
            DEF
          </div>
          <h5 id="current-pokemon-stats-def">{currentPokemon.stats.defense}</h5>
        </div>
        <div className="current-pokemon-stats-container column">
          <div className="current-pokemon-stats-name" style={{ background: '#85DDFF' }}>
            SpA
          </div>
          <h5 id="current-pokemon-stats-spa">{currentPokemon.stats.specialAttack}</h5>
        </div>
        <div className="current-pokemon-stats-container column">
          <div className="current-pokemon-stats-name" style={{ background: '#96da83' }}>
            SpD
          </div>
          <h5 id="current-pokemon-stats-spd">{currentPokemon.stats.specialDefense}</h5>
        </div>
        <div className="current-pokemon-stats-container column">
          <div className="current-pokemon-stats-name" style={{ background: '#FB94A8' }}>
            SPD
          </div>
          <h5 id="current-pokemon-stats-speed">{currentPokemon.stats.speed}</h5>
        </div>
        <div className="current-pokemon-stats-container column" style={{ background: '#88AAEA' }}>
          <div className="current-pokemon-stats-name" style={{ background: '#7195DC' }}>
            TOT
          </div>
          <h5 id="current-pokemon-stats-total">
            {Object.values(currentPokemon.stats).reduce((a, b) => a + b, 0)}
          </h5>
        </div>
      </div>

      {/* Evolution Chain */}
      {details?.evolutionChain && details.evolutionChain.length > 1 && (
        <div id="current-pokemon-evolution-chain-container">
          <h4>Evolution</h4>
          <div className="row center">
            {details.evolutionChain.map((evolution, index) => (
              <React.Fragment key={evolution.id}>
                <img
                  id={`current-pokemon-evolution-${index}`}
                  className="current-pokemon-evolution-image"
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.id}.png`}
                  alt={evolution.name}
                />
                {evolution.level && (
                  <div id={`current-pokemon-evolution-level-${index}`} className="current-pokemon-evolution-level-container font-size-12 bold">
                    Lv. {evolution.level}
                  </div>
                )}
                {index < (details.evolutionChain?.length ?? 0) - 1 && (
                  <span className="evolution-arrow">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 