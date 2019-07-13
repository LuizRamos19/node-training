// 10.10.0.165
// vamos instalar o mongodb
// npm install mongodb

// c://Program Files/MongoDB/server/4.0/bin
// colocar o caminho de cima do PATH das variáveis de ambiente

// c:/
//     c:/data/db

// 1 terminal -> mongod
// 2 terminal -> mongo

/*
// Para listar bancos de dados
show dbs
// alteramos o contexto para o banco selecionado
// se não existir, quando inserir um novo dado, ele criará automaticamente
use nomeDoBanco
use caracteres

// para listar coleções (tabelas)
show collections

// para inserir um novo item
db.nomeDaColecao.insert({
    nome: 'teste',
    idade: 12
})
// para trazer todos os registros
db.nomeDaColecao.find()
// para trazer registros filtrados
db.nomeDaColecao.find({ nome: 'teste'})

for (i = 0; i < 1000; i++) {
    db.nomeDaColecao.insert({ nome: 'teste' + i})
}
db.nomeDaColecao.find()
*/
const { MongoClient } = require('mongodb');
class HeroDB {
    constructor() {
        this.heroCollection = {};
    }

    async connect() {
        // para conectar com o mongodb local
        // localhost:27017/[dbName]
        const mongodbString = process.env.MONGO_URI;
        const mongoClient = new MongoClient(mongodbString, { useNewUrlParser: true });
        const connection = await mongoClient.connect();
        const heroCollection = await connection.db(process.env.MONGO_DATABASE).collection(process.env.MONGO_COLLECTION);
        // adicionamos o herói para a instância da classe
        this.heroCollection = heroCollection;
    }

    async register(hero) {
        return this.heroCollection.insertOne(hero);
    }
    
    async list(hero, skip = 0, limit = 10) {
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
        // return this.heroCollection.find().toArray();
        return this.heroCollection.find(filter).skip(skip).limit(limit).toArray();
    }

    async remove(id) {
        return this.heroCollection.deleteOne({ _id: id });
    }

    async update(idHero, heroUpdated) {
        // o primeiro parâmetro é o filtro, o segundo é o que substituirá o arquivo
        // se esquecer de mandar o operador correto, vai perder o dado
        // $set: data -> ESQUECEU O SET -> VAI PERDER
        return this.heroCollection.update(
            { _id: idHero },
            { $set: heroUpdated }
        )
    }
}
// exportamos o módulo
module.exports = HeroDB;

// LEMBRAR DE COMENTAR DEPOIS DE TESTAR
// async function main() {
//     const hero = new HeroDB();
//     const { heroCollection } = await hero.connect();
//     await heroCollection.insertOne({
//         name: 'Flash',
//         power: 'Velocidade',
//         age: 20
//     });

//     const items = await heroCollection.find().toArray();
//     console.log('items ', items);
// }
// main();