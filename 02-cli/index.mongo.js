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
// const HeroDbFile = require('./src/heroDbFile');
const HeroMongoDB = require('./src/heroDb');    // agora é com o mongo e não mais com arquivo
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
    try {
        // const dbFile = new HeroDbFile();
        const dbMongo = new HeroMongoDB();
        await dbMongo.connect();
        console.log("Mongo conectado!")

        const hero = new Hero(commander);
        // node index.mongo.js --cadastrar ou node index.mongo.js -c
        /*
            Para rodar o cli basta executar um desses dois códigos:
                node index.mongo.js \
                    --name Flash \
                    --power Velocidade \
                    --age 80 \
                    --cadastrar
                node index.mongo.js --name Flash --power Velocidade --age 80 --cadastrar
        */
        if (commander.cadastrar) {
            await dbMongo.register(hero);
            console.log('Hero success registered');
            // falamos para o node que terminamos nossa tarefa
            process.exit(0);
            return;
        }
        /*
            node index.mongo.js --nome fl --listar
        */
        if (commander.listar) {
            // no js atualmente usamos dois tipos de variáveis.
            // -> const -> valores que nunca se alteram
            // -> let -> valores que podem ser alterados
            let filter = {};
            if (hero.name) {
                // usamos um operador do mongodb para filtrar frases que contenham aquele texto
                filter = {
                    name: {
                        $regex: `.*${hero.name}*.`,
                        $options: 'i'
                    }
                }
            }
            const heros = await dbMongo.list(filter);
            console.log('chamou listar!', JSON.stringify(heros));
            process.exit(0);
            return;
        }
        /*
            node index.mongo.js --name Flash --power Força --id 328438434 --atualizar
        */
        if (commander.atualizar) {
            const { _id } = hero;
            // para não atualizar com o _id
            if (!_id) {
                throw new Error('o id é obrigatório');
            }
            delete hero._id;
            // gambiarra do bem, para remover as chaves undefined
            const heroFinal = JSON.parse(JSON.stringify(hero));
            await dbMongo.update(_id, heroFinal);
            console.log('Herói atualizado com sucesso!');
            process.exit(0);
            return;
        }
        /*
            node index.mongo.js --id 1562881461433 --remover
        */
        if (commander.remover) {
            const id = hero._id;
            if (!id) {
                throw new Error('Você deve passar um ID');
            }
            await dbMongo.remove(id);
            console.log('Herói removido com sucesso');
            process.exit(0);
            return;
        }
    } catch (error) {
        console.error('DEU RUIM', error);
        process.exit(0);
    }
};

main();