// vamos importar a biblioteca padrão do Node.js para trabalhar com requisições Web
// const http = require('http');
// http.createServer((req, res) => {
//     res.end('HelloWorld');
// }).listen(3000, () => console.log('Server running'));

/*
    // Vamos trabalhar com o padrão Rest
    // Rest x Restfull
    -> JSON (Javascript Schema Object Notation)
    -> Rest -> Padrão (Convenção) de APIs (Não é framework)
    ACAO            | METODO    |   URL
    CADASTRAR       | POST      |   /v1/heroes       -> dados no body
    ATUALIZAR                   |   /v1/heroes/:id   -> dados no body
                ->  | PATCH -> É usado para atualização parcial
                ->  | PUT   -> É usado para substituição toda informação original
    REMOVER         | DELETE    |   /v1/heroes/:id
    LISTAR          | GET       |   /v1/heroes?skip=0&limit=10&name=e
    LISTAR          | GET       |   /v1/heroes/:id/habilities
    LISTAR          | GET       |   /v1/heroes/:id/habilities/:id

    npm install hapi

    // para evitar ficar fazendo IFs, validando na mão, podemos trabalhar com esquemas de validação onde validamos o pedido primeiro antes de
    // passar pelo nosso HANDLER. Para isso usamos o joi.

    npm install joi

    // Para documentar nossa aplicação automagicamente, vamos usar a lib swagger
    // para usa-la precisamos seguir alguns passos
    // -> 1o adicionar o plugin ao Hapi
    // -> 2o adicionar tags (api) nas configs de rotas

    npm install hapi-swagger@9.1.3 inert vision

    // Para não precisar ficar reiniciando o node, vamos instalar uma lib:
    // -D ou --save-dev salva somente para desenvolvimento.
    npm install -D nodemon

    // vamos adicionar scripts automatizados em nosso package.json
    // npx -> ele executa comandos usando a node_modules
    // colocar o comando abaixo no package.json na key de scripts
    "start": "npx nodemon index.api.js"
    // para executar
    npm start
    // caso o comando for qualquer outro nome
    "desenvolvimento": "ola mundo"  
    npm run desenvolvimento -> usamos o RUN para comandos customizados.

    // para padronizar status de operação das APIs usamos o Boom
    npm install boom
*/

const Hapi = require('hapi');
// importamos o Joi para validar as requisições
// toda a vez que for usar, adicionar na config.validate da rota
const Joi = require('joi');
// Para o Swagger são os 3 abaixo, o hapi faz a documentação e o vision e inert cuidam da parte visual
const HapiSwagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert');
// boom para status HTTP
const Boom = require('boom');

const { ObjectID } = require('mongodb');

const Db = require('./src/heroDb');
const app = new Hapi.Server({
    port: 3000
});

async function main() {
    try {
        const database = new Db();
        await database.connect();
        console.log('database connected');
        await app.register([
            Inert,
            Vision,
            {
                plugin: HapiSwagger,
                options: {
                    documentationPath: '/v1/documentation',
                    info: {
                        title: 'API Heroes - Luiz',
                        version: 'v1.0'
                    },
                    lang: 'pt'
                }
            }
        ])
        // vamos definir as rotas
        app.route([
            {
                // localhost:3000/v1/heroes?name=batman
                // localhost:3000/v1/heroes?name=batman&skip=1&limit=2
                path: '/v1/heroes',
                method: 'GET',
                config: {
                    tags: ['api'],
                    description: 'Listar Heróis',
                    notes: 'Pode filtrar por nome e paginar',
                    validate: {
                        // por padrão o hapi não mostra os erros, então manipulamos a função para mostrar
                        failAction: (request, header, error) => {
                            throw error;
                        },
                        // podemos validar headers, query, payload e params
                        query: {
                            name: Joi.string().max(10).min(2),
                            skip: Joi.number().default(0),
                            limit: Joi.number().max(10).default(10)
                        }
                    }
                },
                handler: async (request) => {
                    try {
                        const { query } = request;
                        const { skip, limit } = query;
                        // por padrão, tudo o que vem da Web é string, temos que fazer o mapeamento manual, pois o mongodb na versão 4
                        // não deixa usar mais string para esse caso.
                        return database.list(query, parseInt(skip), parseInt(limit));
                    } catch (error) {
                        console.error('DEU RUIM NO GET HEROES', error);
                        return Boom.internal();
                    }
                }
            },
            {
                // localhost:3000/v1/heroes?name=batman&age=19&power=Teste
                path: '/v1/heroes',
                method: 'POST',
                config: {
                    tags: ['api'],
                    description: 'Cadastrar Heróis',
                    notes: 'Pode cadastrar somente heróis por nome, idade e poder',
                    validate: {
                        failAction: (request, header, error) => {
                            throw error;
                        },
                        payload: {
                            name: Joi.string().max(10).required(),
                            age: Joi.number().min(18).required(),
                            power: Joi.string().max(10).required()
                        }
                    }
                },
                handler: async (request, h) => {
                    try {
                        const { payload } = request;
                        const v = database.register(payload);
                        // código rest correto para created
                        return h.response(v).code(201);
                    } catch (error) {
                        console.error('DEU RUIM NO POST HEROES', error);
                        return Boom.internal(); //retornar o erro 500
                    }
                }
            },
            {
                path: '/v1/heroes/{id}',
                method: 'DELETE',
                config: {
                    tags: ['api'],
                    description: 'Remover Heróis',
                    notes: 'Pode remover os heróis a partir do seu id',
                    validate: {
                        failAction: (request, header, error) => {
                            throw error;
                        },
                        params: {
                            id: Joi.string().max(40).required(),
                        }
                    }
                },
                async handler(request) {
                    try {
                        const { id } = request.params;
                        return database.remove(ObjectID(id));
                    } catch (error) {
                        console.error('DEU RUIM NO DELETE HEROES', error);
                        return Boom.internal();
                    }
                }
            },
            {
                path: '/v1/heroes/{id}',
                method: 'PATCH',
                config: {
                    tags: ['api'],
                    description: 'Alterar Heróis',
                    notes: 'Pode alterar os heróis parcialmente a partir do seu id',
                    validate: {
                        failAction: (request, header, error) => {
                            throw error;
                        },
                        params: {
                            id: Joi.string().max(40).required(),
                        },
                        payload: {
                            name: Joi.string().max(10).min(2),
                            power: Joi.string().max(10).min(2),
                            age: Joi.number().min(18)
                        }
                    }
                },
                async handler(request) {
                    try {
                        // const { id } = request.params;
                        // const { payload } = request;
                        const {
                            params: {
                                id
                            },
                            payload
                        } = request;    // outra forma de retirar os valores necessários
                        return database.update(ObjectID(id), payload);
                    } catch (error) {
                        console.error('DEU RUIM NO UPDATE PATCH HEROES', error);
                        return Boom.internal();
                    }
                }
            }
        ]);
        await app.start();
        console.log(`server running, ${app.info.host}:${app.info.port}`);
    } catch (error) {
        console.error('DEU RUIM', error);
    }
}

main();