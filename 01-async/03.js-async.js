/*
    A galera do C# implementou uma funcionalidade onde não precisamos mais usar .then e .catch

    Nosso código javascript fica exatamente igual a aplicativos JAVA, Python, C#
    -> O mesmo código que é lido, a ordem será executada.
*/
const { promisify } = require('util');  //Técnica chamada de DESTRUCTURING

// convertemos a função searchPhone
const searchPhoneAsync = promisify(searchPhone);

function searchClients(id) {
    // para simular uma função assíncrona, usamos o setTimeout
    // retornamos um objeto Promise para resolver depois
    
    return new Promise(function (resolve, reject) {
        setTimeout(function() {
            return resolve({
                id: 1,
                name: 'Xuxa da Silva',
                age: 70
            });
        }, 2000);
    });
}

function searchAddress(clientId) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            return resolve({
                id: clientId,
                street: 'dos bobos',
                number: 0
            });
        }, 2000);
    });
}

function searchPhone(clientId, callback) {
    setTimeout(() => {
        return callback(null, {
            id: 1,
            ddd: 11,
            number: '4002-8900'
        });
    }, 3000);
}

// para usar o await, precisa do async
// -> quando usamos o async, automaticamente a função passa a retornar um objeto Promise
(async function main() {
    try {
        console.time('async-01')
        // para sinalizar o código js para esperar a execução, usamos a palavra chave await
        const client = await searchClients('xuxa');
        // Como o endereço e o telefone não dependem um do outro, podemos executá-los em segundo plano.
        // const { street, number } = await searchAddress(client.id);
        // const phone = await searchPhoneAsync(client.id);
        const addressPromise = searchAddress(client.id);
        const phonePromise = searchPhoneAsync(client.id);
        // retorna um array na ordem exata das funções
        const [address, phone] = await Promise.all([addressPromise, phonePromise]);
        console.timeEnd('async-01')

        console.log(`
            Nome: ${client.name}
            Endereço: ${address.street}, ${address.number}
            Telefone: (${phone.ddd}) ${phone.number}
        `.replace(/\s{2,}/g, '\n'));
    } catch (error) {
        console.error(error);
    }
})();