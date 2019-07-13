// importamos o módulo para trabalhar com arquivos
const {
    exists,
    promises: {
        writeFile,
        readFile
    }
} = require('fs');
// o exists não existe na promises API, precisamos converter manualmente
// -> o exists não segue o padrão CALLBACK, então não conseguimos usar o promisify nele. Para isso:
//      1o importamos o exists padrão
//      2o converter para promise
const existsAsync = (param) => new Promise((resolve, reject) => {exists(param, (exist) => resolve(exist))});

class HeroDbFile {
    constructor() {
        this.FILE_NAME = 'heroes.json';
    }

    async _getFile() {
        // verificamos se o arquivo existe antes de acessar seu conteúdo
        if (! await existsAsync(this.FILE_NAME)) {
            return [];
        }
        // lemos o arquivo direto e convertemos para JSON
        const text = await readFile(this.FILE_NAME);
        return JSON.parse(text);
    }

    async _writeFile(data) {
        // pegamos o dado no formato objeto js e convertemos para texto com a função abaixo
        const textData = JSON.stringify(data);
        await writeFile(this.FILE_NAME, textData);

        return;
    }

    async register(hero) {
        // obtemos os heróis
        const heroes = await this.list();
        // criar id baseado na hora
        hero.id = Date.now();
        heroes.push(hero);
        await this._writeFile(heroes);
        return;
    }
    // vamos definir que o filtro é opcional
    async list(filter = {}) {
        // caso o cliente não filtrar dados, retornamos todos os itens
        const data = await this._getFile();
        
        if (!Object.keys(filter).length) {
            return data;
        }

        // para entrar em cada item da lista, para cada item, chamaremos uma função,
        // caso a asserção for verdadeira, ele continua no Array
        const dataFiltered = data.filter(hero => {
            return ~hero.name.toLowerCase().indexOf(filter.name.toLowerCase());    //o tio serve para que se o resultado for -1, ele considera como false
        });
        return dataFiltered;
    }

    async remove(idHero) {
        const data = await this._getFile();
        const dataFiltered = data.filter(( { id } ) => id !== parseInt(idHero));
        return await this._writeFile(dataFiltered);
    }

    async update(idHero, heroUpdated) {
        const data = await this._getFile();
        const indexOldHero = data.findIndex(( { id } ) => id === parseInt(idHero));

        if (indexOldHero === -1) {
            throw new Error('O herói não existe');
        }
        const atual = data[indexOldHero];
        // removemos o item da lista
        // o segundo parâmetro e falar quantos vai remover
        data.splice(indexOldHero, 1);
        // para remover todas as chaves que estejam vazias (undefined) precisamos converter o objeto 
        // para String e depois para objeto novamente
        const objText = JSON.stringify(heroUpdated);
        const objFinal = JSON.parse(objText);

        const heroChanged = {
            ...atual,
            ...objFinal
        }

        const newList = [
            ...data,
            heroChanged
        ]

        await this._writeFile(newList);
        return;
    }
}

// exportamos a nossa classe
module.exports = HeroDbFile;

// testamos a classe
// LEMBRAR DE COMENTAR DEPOIS
// async function main() {
//     const myClass = new HeroDbFile();
//     // await myClass.register({
//     //     name: "Batman",
//     //     power: "Money"
//     // })
//     // const data = await myClass._getFile();
//     const data = await myClass.list({name: "Flash"});
//     console.log('data ', data);
// };

// main();