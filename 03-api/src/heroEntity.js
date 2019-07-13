const { ObjectID } = require('mongodb');

class Hero {
    // Extraimos somente o necessário para criar o Herói
    constructor({ id, name, age, power }) {
        // caso o id venha preenchido, convertemos para o formato do banco de dados, caso 
        // não venha, mantemos o padrão.
        this._id = id ? ObjectID(id) : id;
        this.name = name;
        this.age = age;
        this.power = power;
    }
}
// Exportamos a classe para o MUNDO
module.exports = Hero