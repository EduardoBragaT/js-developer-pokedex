const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const maxRecords = 151;
const limit = 10;
let offset = 0;


function soundPokemon() {
    let audio = new Audio();
    audio.src = this.querySelector(".url_audio").value
    audio.volume = 0.05;
    audio.play();
}

function loadPokemonItens(offset, limit) {
    pokeApi
        .getPokemons(offset, limit)
        .then((pokemons = []) => {
            const newHTML = pokemons.map((pokemon) => `
                <li class="pokemon ${pokemon.type}">
                    <span class="number">#${pokemon.number}</span>
                    <span class="name">${pokemon.name}</span>
                    <div class="detail">
                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join("")}
                        </ol>
                        <div class="image_container">
                            <img src="${pokemon.photo}" alt="${pokemon.name}">
                        </div>
                        <input type="hidden" name="sound" class="url_audio" value="${pokemon.cry}">
                    </div>
                </li>
        `).join("");
            pokemonList.innerHTML += newHTML;

            const newPokemons = pokemonList.querySelectorAll('.pokemon');
            newPokemons.forEach(pokemon => {
                pokemon.addEventListener('click', soundPokemon);
            });
        })
}

function loadPokemonScrollEnd() {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
        loadPokemonItensLimited();
    }
}

function checkScroll() {
    if (document.body.scrollHeight <= window.innerHeight) {
        // Ação a ser executada enquanto não houver espaço de rolagem
        loadPokemonItensLimited();
        setTimeout(()=>{requestAnimationFrame(checkScroll)},500); // Continua verificando
    } else {
        // Ação a ser executada quando houver espaço para rolagem
        console.log("Espaço de rolagem detectado!");
    }
}
function loadPokemonItensLimited() {
    offset += limit;
    const qtdRecordNextPage = offset + limit;
    if (qtdRecordNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
        window.removeEventListener("scroll", loadPokemonScrollEnd)
    } else {
        loadPokemonItens(offset, limit);
    }

}

loadPokemonItens(offset, limit);
loadMoreButton.addEventListener('click', loadPokemonItensLimited)

window.addEventListener('scroll', loadPokemonScrollEnd);


checkScroll(); 