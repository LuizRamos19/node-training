/*
    promise = new Promise(function (resolve, reject) {
        return reject(VALOR) => erro
        return resolve(VALOR) => sucesso
    })

    para capturar resultados
    promise
        -> resultado -> .then
        -> error -> .catch
        -> finally -> .finally
*/

// importamos o módulo interno do Node.js para converter callbacks para Promises.
// IMPORTANTE: Caso a função que tenha callback não seguir a convenção (erro, sucesso), não vai conseguir realizar a conversão
// const util = require('util');
// util.promisify
// util.log
// util.isString
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

(function main() {
    const clientesPromise = searchClients('xuxa');
    clientesPromise
        .then(function(client) {
            const clientId = client.id;
            return searchAddress(clientId)
                .then(function (address) {
                    return {
                        id: clientId,
                        name: client.name,
                        address: `${address.street}, ${address.number}`
                    }
                });
        })
        .then(function(clientAddress) {
            const { id } = clientAddress;

            return searchPhoneAsync(id)
                .then(function (phone) {
                    // para clonar o objeto
                    // reutilizar todas as chaves adicionando o necessário
                    return {
                        ...clientAddress,            // vai colocar todas as chaves e coloca no mesmo nível do return
                        phone: `(${phone.ddd}) ${phone.number}`
                    }
                });
        })
        .then(function(result) {
            console.log('result ', result);
        })
        .catch(function(error) {
            console.error('DEU RUIM', error);
        })
})();