
interface Props{
    name: string;
    id: number;
    image: string;
}
const PokemonList:React.FC<Props>= (props) => {
    const {name,id, image}= props;
  return (
    <div className="">
        <section className="pokemon-list-container" key={id}>
            <p className="pokemon-name">{name}</p>
            <img src={image} alt="pokemon"/>
        </section>
    </div>
  )
}

export default PokemonList