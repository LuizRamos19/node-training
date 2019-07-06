/*
    Nosso objetivo é seguir os seguintes passos:

    1. Buscar cliente
    2. Buscar endereço
    3. Buscar telefone

    //NomeCliente, Endereço, Telefone

    para rodar uma app node nomeArquivo.js ou no VSCODE - F5

    Para sincronizar aplicações trabalhamos com uma convenção chamada CALLBACK.

    Callbacks tem como objetivo passar uma função e executar após o agendamento.

    callbacks -> geralmente recebem no mínimo 2 parâmetros (1º erro, 2º sucesso)
*/

function searchClients(id, callback) {
    // para simular uma função assíncrona, usamos o setTimeout
    setTimeout(function() {
        return callback(null, {
            id: id,
            name: 'Xuxa da Silva',
            age: 70
        });
    }, 2000);
}

function searcAddress(clientId, callback) {
    setTimeout(() => {
        return callback(null, {
            id: 1,
            street: 'dos bobos',
            number: 0
        });
    }, 2000);
}

function searcPhone(clientId, callback) {
    setTimeout(() => {
        return callback(null, {
            id: 1,
            ddd: 11,
            number: '4002-8900'
        });
    }, 3000);
}

(function main() {
    searchClients('xuxa', function(error, success) {
        // undefine, 0, '', null, [], {}
        // -> false
        if (error) {
            console.error('DEU RUIM', error);
            return;
        }
        searcAddress(success.id, function(error1, success1) {
            if (error1) {
                console.log('DEU RUIM', error1);
                return;
            }
            searcPhone(success1.id, function(error2, success2) {
                if (error2) {
                    console.log('DEU RUIM', error2);
                    return;
                }
                console.log(
                    `Nome: ${success.name}
                    Endereço: ${success1.street} ${success1.number}
                    Telefone: (${success2.ddd}) ${success2.number}`.replace(/\s{2,}/g, '\n')
                );
            })
        });
    });
    // const address = searcAddress(client.id);

    // console.log(client.id, address.street)
})();

// main();