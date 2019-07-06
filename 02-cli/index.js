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
const Hero = require('./src/heroEntity')
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

(function main() {
    const hero = new Hero(commander);
    // node index.js --cadastrar ou node index.js -c
    /*
        node index.js \
            --name Flash \
            --power Velocidade \
            --age 80 \
            --cadastrar
        node index.js --name Flash --power Velocidade --age 80 --cadastrar
    */
    switch(commander) {
        case 'cadastrar':
            console.log('chamou cadastrar!', hero);
            return;
        case 'atualizar':
            console.log('chamou atualizar!', hero);
            return;
        case 'listar':
            console.log('chamou listar!', hero);
            return;
        case 'remover':
            console.log('chamou remover!', hero);
            return;
    }
})()