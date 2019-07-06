class Hero {
    // Extraimos somente o necessário para criar o Herói
    constructor({ id, name, age, power }) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.power = power;
    }
}
// Exportamos a classe para o MUNDO
module.exports = Hero