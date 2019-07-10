// URL: https://swapi.co/api/people/?search=luke&format=json
// URL: https://swapi.co/api/starships/1

/*
 npm init -y
 npm install request
*/
const { deepEqual } = require('assert');
// usar esta
const STARWARS_URL = 'https://swapi.co/api/people/?search=luke&format=json';
const request = require('request');

// precisamos converter de callback para promise
const { promisify } = require('util');
const obterResultAsync = promisify(obterRespostaDoStarWarsCallback);

function obterRespostaDoPokemon(url, callback) {
  request(url, (err, res) => {
    if (err) {
      console.error('DEU RUIM', err);
      return callback(err, null);
    }
    return callback(null, JSON.parse(res.body));
  });
}
function obterRespostaDoStarWarsCallback(url, callback) {
  request(url, (err, res) => {
    if (err) {
      console.error('DEU PIOR', err);
      return callback(err, null);
    }
    return callback(null, JSON.parse(res.body));
  });
}

function getStarwarsResult(res, starship) {
  let { gender, hair_color, height, homeworld, mass, name, skin_color } = res;
  return {
    gender, hair_color, height, homeworld, mass, name, skin_color, starship
  }
}
function main() {
  const esperado = {
    gender: 'male',
    hair_color: 'blond',
    height: '172',
    homeworld: 'https://swapi.co/api/planets/1/',
    mass: '77',
    name: 'Luke Skywalker',
    skin_color: 'fair',
    // created: '2014-12-09T13:50:51.644000Z',
    // edited: '2014-12-10T13:52:43.172000Z',
    starship: {
      name: 'X-wing',
      model: 'T-65 X-wing',
    },
  };
  const resultadoComCallback = null;
  obterRespostaDoStarWarsCallback(STARWARS_URL, (err, res) => {
    obterRespostaDoStarWarsCallback(res.results[0].starships[0], (err1, {name, model}) => {
      let atual = getStarwarsResult(res.results[0], { name, model });
      deepEqual(atual, esperado);
    })
  });
  const resultadoComPromise = null;
  obterResultAsync(STARWARS_URL)
    .then(function({ results: [people] }) { //esse código é a mesma coisa desse daqui: const people = results[0]
      const {starships: [starship]} = people; //esse código é a mesma coisa desse daqui: const starship = people.starships[0]
      return {
        ...people,
        starship
      }
    })
    .then(function(people) {
      return obterResultAsync(people.starship)
        .then(function({name, model}) {
          const atual = getStarwarsResult(people, {name, model});
          deepEqual(atual, esperado);
        })
        .catch(function(error) {
          console.error(error);
        })
    })
  const resultadoComAsyncAwait = null;
  async function obterDados () {
    const { results: [people] } = await obterResultAsync(STARWARS_URL);
    const { starships: [starship] } = people;
    const { name, model } = await obterResultAsync(starship);
    const atual = getStarwarsResult(people, {name, model});
    deepEqual(atual, esperado);
  }
  obterDados();
  // FAZER FUNCIONAR ESTE ABAIXO
    // deepEqual(resultadoComCallback, esperado);
    // deepEqual(resultadoComPromise, esperado);
    // deepEqual(resultadoComAsyncAwait, esperado);
}
// usar como exemplo
function testComPokemon() {
    const esperadoPokemon = { name: 'pikachu', base_experience: 112 };
    const POKE_URL = 'https://pokeapi.co/api/v2/pokemon/pikachu'
    obterRespostaDoPokemon(POKE_URL, (err, res) => {
      deepEqual({ name : res.name,  base_experience: res.base_experience }, esperadoPokemon);
    });
}
main();
// esse é só para testar se funciona
testComPokemon();