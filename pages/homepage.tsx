import PokemonCollection from "@/components/DogCollection/PokemonCollection";
import { Pokemon } from "@/components/interface";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { InferGetServerSidePropsType } from "next";
import { useEffect, useState } from "react";

interface Pokemons {
    name: string;
    url: string;
  }

  export interface Detail {
    id: number;
    isOpened: boolean;
  }

  
const superbase= createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);


const Homepage = ({users}:InferGetServerSidePropsType<typeof getServerSideProps>) => {

    const [pokemon, setPokemon]= useState<Pokemon[]>([]);
   // const name = users.map(user=> user.displayName==='Van')
    //console.log('name',name)
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
            <header className="pokemon-header">Pokemon Website 
              {` Hi `+ users[0].displayName }
            </header>
            <PokemonCollection pokemons={pokemon}/>
        </div>
    </div>
  )
}

export async function getServerSideProps() {
  const { data: users, error } = await superbase.from('users').select('displayName');
  console.log('data', users);
  if (error) {
    console.error(error);
    return { props: {} };
  }

  return { props: { users } };
}

export default Homepage