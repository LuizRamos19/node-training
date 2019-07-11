// para instalar pacotes externos usamos a ferramenta NPM (Node Package Managar) ou YARN

// Para iniciar um projeto node.js precisamos de um arquivo que define os pacotes. Quando outra
// pessoa precisar acessar seu código, este arquivo lhe ensina como instalar ou quais versões são suportadas.

/* Para iniciar um projeto:

    -> npm init -y  // o -y significa que não precisa de wizard

*/

/* Para trabalhar com programas de linha de comando usaremos o commander
    npm install commander --save // o --save já vai por padrão, então não precisa
    --save-dev -> Ferramentas como transpiladores, testes, ferramentas para diminuir o tamanho
                  do arquivo
*/
// Importamos o herói
const Hero = require('./src/heroEntity');
const HeroDbFile = require('./src/heroDbFile');
// Importamos o Commander
const Commander = require('commander')
const commander = Commander
                    .version('v1.0')
                    .option('-n, --name [value]', 'O nome do Herói')    // [value] indica que o que vem depois é o valor
                    .option('-i, --age [value]', 'A idade do Herói')
                    .option('-I, --id [value]', 'O id do Herói')
                    .option('-p, --power [value]', 'O poder do Herói')
                    // definimos opções para utilizar de acordo com a chamada do cliente
                    .option('-c, --cadastrar', 'deve cadastrar um Herói')
                    .option('-a, --atualizar [value]', 'deve atualizar um Herói')
                    .option('-r, --remover', 'deve remover um Herói')
                    .option('-l, --listar', 'deve listar um Herói')
                    .parse(process.argv);

async function main() {
    const dbFile = new HeroDbFile();

    const hero = new Hero(commander);
    // node index.js --cadastrar ou node index.js -c
    /*
        Para rodar o cli basta executar um desses dois códigos:
            node index.js \
                --name Flash \
                --power Velocidade \
                --age 80 \
                --cadastrar
            node index.js --name Flash --power Velocidade --age 80 --cadastrar
    */
    if (commander.cadastrar) {
        await dbFile.register(hero);
        console.log('Hero success registered');
        return;
    }
    /*
        node index.js --nome fl --listar
    */
    if (commander.listar) {
        // no js atualmente usamos dois tipos de variáveis.
        // -> const -> valores que nunca se alteram
        // -> let -> valores que podem ser alterados
        let filter = {};
        if (hero.name) {
            filter = { name: hero.name }
        }
        const heros = await dbFile.list(filter);
        console.log('chamou listar!', JSON.stringify(heros));
        return;
    }
    /*
        node index.js --name Flash --power Força --id 328438434 --atualizar
    */
    if (commander.atualizar) {
        const { id } = hero;
        // para não atualizar o ID, vamos remover
        delete hero.id;
        await dbFile.update(id, hero);
        console.log('Herói atualizado com sucesso!');
        return;
    }
    /*
        node index.js --id 1562881461433 --remover
    */
    if (commander.remover) {
        const id = hero.id;
        if (!id) {
            throw new Error('Você deve passar um ID');
        }
        await dbFile.remove(id);
        console.log('Herói removido com sucesso');
        return;
    }
};

main();