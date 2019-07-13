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

    // Um padrão conhecido na web para autenticar APIs Restfull, é conhecido como JWT -> JSON Web Token

    -> Autenticação
        -> Login
    -> Autorização
        -> Permissão de acesso
    
    // Vamos usar o melhor computador do mundo (o do cliente), uma vez logado, fornecemos um TOKEN que 
    // informa que o user usa a cada chamada.
    // Não usamos sessão ou cookies pois honera o servidor, é difícil de escalar e gasta mais memória.

    // Precisamos de duas rotas
    // Pública -> Login
    // Privadas -> Todas as nossas APIs

    // vamos instalar um pacote para manipular TOKEN
        -> Sign, Verify, jwt.io
    npm install jsonwebtoken

    // Para validar todos os requests baseado numa estratégia padrão de autenticação, precisamos instalar o hapi jwt.
    // Requests validam token primeiro e só depois chamam o handler.

    npm install hapi-auth-jwt2
    -> 1o Registrar o Plugin
    -> 2o Criar a estratégia JWT (que vai refletir em todas as rotas)
    -> 3o passo, colocar auth: false nas rotas públicas

    // Para gerenciar ambientes
    -> Produção
    -> Desenvolvimento
    -> Homologação

    // Vamos dividir nossos ambientes
    config
        -> .env.development
        -> .env.production

    npm install dotenv
    // IMPORTANTE: Só chamamos a configuração no arquivo inicial.

    // para usar variáveis de ambiente multiplataforma, instalamos o cross-env
    npm install cross-env

    // Primeiro criamos o banco de dados na mongodb.com
    // -> criamos o user (Security -> Database Access -> Add User)
    // -> liberamos o ip (Security Network Access -> Add IP Address -> Allow any ip)

    // Pegamos a conexão -> Clusters -> Connect -> Connect Application e copiamos a string <user>:<password>...
    // voltamos a maquina local e testamos a conexão mongo stringMongoDB
    show dbs

    copiamos e colamos .env.dev... e criamos o .prod
    // -> substituimos a KEY do JWT por uma escolhida por nós
    // -> Adicionamos a nova string do Mongo
        // -> removemos tudo que tinha de /teste para frente
        // -> substituimos o /teste pela nossa db /caracteres

    // -> adicionamos no package.json o script para prod

    npm install -g heroku
    heroku login

    heroku apps -> para listar as aplicações

    // para subir a aplicação e gerar a URL automática no heroku
    1o git init
    1.1o criar o arquivo Procfile
        -> Arquivo do heroku ensinando como rodar nossa APP
    2o npx gitignore node -> vai criar um arquivo para ignorar arquivos comuns do node (build, node_modules, bin)
    TODA ALTERAÇÃO QUE FOR PARA PROD, RODAR OS PASSOS ABAIXO (3, 4, 6)
    3o git add .
    4o git commit -m "Versão 1"
    5o heroku apps:create meuNome-heroes
    // -> após esse processo o heroku vai adicionar a origin em nosso repo local
    6o git push heroku master

    heroku logs -a nomeDoApp -t     // -> -t Tail, reflete qualquer alteração no terminal

    // Se der problema ele QUEBRA e NÃO VOLTA
    // Não sabemos quanto de CPU/MEMORIA/DISCO a aplicação está usando e fica difícil saber se precisa escalar 

    npm install pm2
    // pm2 keymetrics

    pm2 list -> lista as aplicações
    pm2 start -> nomeArquivo.js -i 10 // -i -> quantidade de instâncias
    pm2 stop
    pm2 monit
    pm2 logs 1

    // ENV PM2_PUBLIC_KEY vcczxrzwpwpv74f
    // ENV PM2_SECRET_KEY tnsynqmpkb87n6k

    heroku config:set PM2_PUBLIC_KEY=vcczxrzwpwpv74f PM2_SECRET_KEY=tnsynqmpkb87n6k

    // Podemos usar também um pacote NPM para fazer teste de carga

    npm install -g autocannon

    --header 'Accept: application/json' --header 'authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNoYXBvbGluIiwiaWF0IjoxNTYzMDQwODc5LCJleHAiOjE1NjMwNDA5Mzl9.JfTpAkEUypF2gAB2sn2eoldTgIl6qQkWGFGc3gFC4sY' 'https://myapi-heroes.herokuapp.com/v1/heroes?skip=0&limit=10'
    
    autocannon 'https://myapi-heroes.herokuapp.com/v1/heroes?skip=0&limit=10'
                --header 'Accept: application/json'
                --header 'authorization: MyToken'
                --header 'Content-Type: application/json' -c 5 -d 2 -r 2

    autocannon 'https://myapi-heroes.herokuapp.com/v1/heroes?skip=0&limit=10'
    --header 'Accept: application/json' --header 'authorization: MyToken'
    --header 'Content-Type: application/json'
    --duration 10
    --concurrent 300

    // Por padrão aplicações vem fechadas e você define quem pode acessar a sua API. Se alguém tentar acessar vai cair no erro 
    // (Cross Origin Resource Source (CORS))

*/

// fazemos a configuração de ambiente antes de todos os pacotes, pois se algum deles precisar usar algumas
// dessas variáveis não será afetado
const { config } = require('dotenv');
const env = process.env.NODE_ENV;
config({
    path: `./config/.env.${env}`
})

console.log('PROCESS', process.env)

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

// jwt para manipular TOKEN
const Jwt = require('jsonwebtoken');
// hapi jwt para validar em todos os request
const HapiJwt = require('hapi-auth-jwt2');

const { ObjectID } = require('mongodb');

const Db = require('./src/heroDb');
const app = new Hapi.Server({
    port: process.env.PORT,
    // devemos informar quem pode acessar a nossa API
    routes: {
        // outra opção
        // cors: true   -> libera pra todo mundo também
        cors: {
            // podemos informar a lista de clientes que podem acessar.
            // Para liberar a todos, deixamos o *
            origin: ['*'],
        }
    }
});

const MY_SECRET_KEY = process.env.JWT_KEY;
const USER = {
    username: process.env.USER_API,
    password: process.env.PASSWORD_API
}
const defaultHeader = Joi.object({
    authorization: Joi.string().required()
}).unknown();

async function main() {
    try {
        const database = new Db();
        await database.connect();
        console.log('database connected');
        await app.register([
            // Auth
            HapiJwt,
            // Swagger
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
                    lang: process.env.LANG_API
                }
            }
        ]);
        // Criamos uma estratégia de autenticação padrão para refletir em todas as rotas
        app.auth.strategy('jwt', 'jwt', {
            key: MY_SECRET_KEY,
            validate: (data, request) => {
                // poderíamos validar o user no banco, verificar se ele está com a conta em dia ou mesmo se continua ativo na base
                return {
                    isValid: true
                }
            }
        });
        // defini que será a padrão
        app.auth.default('jwt');
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
                        },
                        headers: defaultHeader
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
                        },
                        headers: defaultHeader
                    }
                },
                handler: async (request, h) => {
                    try {
                        const { payload } = request;
                        const v = await database.register(payload);
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
                        },
                        headers: defaultHeader
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
                        },
                        headers: defaultHeader
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
            },
            {
                path: '/v1/login',
                method: 'POST',
                config: {
                    // desabilitamos a autenticação no login, pois será a única rota públic
                    auth: false,
                    tags: ['api'],
                    description: 'Fazer login',
                    notes: 'Login com user e senha',
                    validate: {
                        failAction: (request, header, error) => {
                            throw error;
                        },
                        payload: {
                            username: Joi.string().max(10).required(),
                            password: Joi.string().min(3).max(100).required()
                        }
                    }
                },
                async handler({ payload: {username, password} }) {
                    try {
                        if (username !== USER.username || password !== USER.password) {
                            return Boom.unauthorized();
                        }
                        const tokenPayload = { username };
                        const token = Jwt.sign(tokenPayload, MY_SECRET_KEY, {
                            expiresIn: '60s'
                        });
                        return token;
                    } catch (error) {
                        console.error('DEU RUIM NO LOGIN', error);
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