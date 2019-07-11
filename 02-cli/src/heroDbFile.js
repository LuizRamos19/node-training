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
        this.FILE_NAME = 'heros.json';
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
        const heros = await this.list();
        // criar id baseado na hora
        hero.id = Date.now();
        heros.push(hero);
        await this._writeFile(heros);
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
        console.log("Teste ", dataFiltered)
        return dataFiltered;
    }
}

// exportamos a nossa classe
module.exports = HeroDbFile;

// testamos a classe
// LEMBRAR DE COMENTAR DEPOIS
(async function main() {
    const myClass = new HeroDbFile();
    // await myClass.register({
    //     name: "Batman",
    //     power: "Money"
    // })
    // const data = await myClass._getFile();
    const data = await myClass.list({name: "Flash"});
    console.log('data ', data);
})();