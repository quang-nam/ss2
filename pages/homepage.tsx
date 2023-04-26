import { useEffect, useState } from "react"
import axios from "axios"
import PokemonCollection from "@/components/DogCollection/PokemonCollection";
import { Pokemon } from "@/components/interface";

interface Pokemons {
    name: string;
    url: string;
  }

  export interface Detail {
    id: number;
    isOpened: boolean;
  }
const Homepage = () => {
    const [pokemon, setPokemon]= useState<Pokemon[]>([]);
    useEffect(()=>{
        const getPokemon = async()=>{
            const res= await axios.get(
                "https://pokeapi.co/api/v2/pokemon?limit=20&offset=20"
            );
            res.data.results.forEach(async(pokemon:Pokemons)=>{
                const poke = await axios.get(
                    `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
                )
                setPokemon((p)=>[...p, poke.data])// list of pokemon
            })
            console.log("pokemon", pokemon)
        }

        getPokemon()
    },[])
  return (
    <div className="AppPokemon">
        <div className="container">
            <header className="pokemon-header">Pokemon</header>
            <PokemonCollection pokemons={pokemon}/>
        </div>
    </div>
  )
}

export default Homepage