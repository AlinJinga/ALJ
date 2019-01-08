var express = require('express');
var aplicatie = express();
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');
var sequelize = new Sequelize('restaurante', 'root', '', {
    dialect: 'mysql',
    host: 'localhost'
});

aplicatie.use(bodyParser.json());

var Restaurant = sequelize.define('restaurant', {
    denumire: {
        allowNull: false,
        type: Sequelize.STRING
    },
    capacitate: {
        allowNull: false,
        type: Sequelize.INTEGER,
    },
    nume_patron: {
        allowNull: false,
        type: Sequelize.STRING,
    }
});

var Tip = sequelize.define('tip', {
    nume_tip: {
        allowNull: false,
        type: Sequelize.STRING
    }
});

var Franciza = sequelize.define('franciza', {
    nume_franciza: {
        allowNull: false,
        type: Sequelize.STRING
    },
    pret: {
        allowNull: false,
        type: Sequelize.INTEGER
    }
});

var User = sequelize.define('user', {
    nume: {
        allowNull: false,
        type: Sequelize.STRING,
    },
    nume_cont: {
        allowNull: true,
        type: Sequelize.STRING,
    },
    parola: {
        allowNull: true,
        type: Sequelize.STRING,
    },
    adresa_email: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
            isEmail: true
        }
    }
});

Tip.hasMany(Restaurant);
Franciza.hasMany(Restaurant);

aplicatie.get('/create', async (req, res) => {
    try {
        await sequelize.sync({ force: true });
        res.status(201).json({ message: 'Structura bazei de date realizata' });
    }
    catch (e) {
        console.warn(e);
        res.status(500).json({ message: 'Eroare la crearea structurii BD.' });
    }
})

aplicatie.get('/user/:numeCont', async (req, res) => {
    var user = await User.find({
        where: {
            nume_cont: req.params.numeCont
        }
    });
    if (user) {
        res.status(200).json(user);
    }
    else {
        res.status(404).json({ message: 'Utilizatorul nu a fost gasit' });
    }
});

aplicatie.post('/user', async (req, res) => {
    await User.create(req.body);
    res.status(200).json({ message: 'Utilizator creat cu succes.' });
})

aplicatie.put('/user/:id', async (req, res) => {
    var user = await User.findById(req.params.id);
    if (user) {
        await user.update(req.body);
        res.status(200).json({ message: 'Utilizator modificat cu succes.' });
    }
    else {
        res.status(404).json({ message: 'Eroare la modificare utilizatorului.' });
    }
});

aplicatie.get('/restaurante', async (req, res) => {
    var restaurante = await Restaurant.findAll();
    if (restaurante) {
        res.status(200).json(restaurante);
    }
    else {
        res.status(404).json({ message: 'Eroare' });
    }
});

aplicatie.get('/restaurante/:idFranciza', async (req, res) => {
    var restaurante = await Restaurant.findAll({
        where: {
            francizaId: req.params.idFranciza
        }
    });
    if (restaurante) {
        res.status(200).json(restaurante);
    }
    else {
        res.status(404).json({ message: 'Eroare' });
    }
});

aplicatie.get('/restaurante/:idTip', async (req, res) => {
    var restaurante = await Restaurant.findAll({
        where: {
            tipId: req.params.idTip
        }
    });
    if (restaurante) {
        res.status(200).json(restaurante);
    }
    else {
        res.status(404).json({ message: 'Eroare' });
    }
});

aplicatie.post('/restaurant', async (req, res) => {
    await Restaurant.create(req.body);
    res.status(200).json({ message: 'Restaurant creat cu succes.' });
})

aplicatie.put('/restaurant/:id', async (req, res) => {
    var restaurant = await Restaurant.findById(req.params.id);
    if (restaurant) {
        await restaurant.update(req.body);
        res.status(200).json({ message: 'Restaurant modificat cu succes.' });
    }
    else {
        res.status(404).json({ message: 'Eroare la modificare restaurant.' });
    }
});

aplicatie.delete('/restaurant/:id', async (req, res) => {
    var restaurant = await Restaurant.findById(req.params.id);
    if (restaurant) {
        await restaurant.destroy()
        res.status(200).json({ message: 'Restaurant sters cu succes.' });
    }
    else {
        res.status(404).json({ message: 'Eroare la stergerea restaurantului.' });
    }
});

aplicatie.get('/tipuri', async (req, res) => {
    var tipuri = await Tip.findAll();
    if (tipuri) {
        res.status(200).json(tipuri);
    }
    else {
        res.status(404).json({ message: 'Eroare' });
    }
})

aplicatie.post('/tip', async (req, res) => {
    await Tip.create(req.body);
    res.status(200).json({ message: 'Tip creat cu succes.' });
});

aplicatie.get('/francize', async (req, res) => {
    var francize = await Franciza.findAll();
    if (francize) {
        res.status(200).json(francize);
    }
    else {
        res.status(404).json({ message: 'Eroare' });
    }
});

aplicatie.post('/franciza', async (req, res) => {
    await Franciza.create(req.body);
    res.status(200).json({ message: 'Franciza creat cu succes.' });
})

aplicatie.put('/franciza/:id', async (req, res) => {
    var franciza = await Franciza.findById(req.params.id);
    if (franciza) {
        await franciza.update(req.body);
        res.status(200).json({ message: 'Fracinza modificat cu succes.' });
    }
    else {
        res.status(404).json({ message: 'Eroare la modificare franciza.' });
    }
});

aplicatie.delete('/franciza/:id', async (req, res) => {
    var franciza = await Franciza.findById(req.params.id);
    if (franciza) {
        await franciza.destroy()
        res.status(200).json({ message: 'Franciza sters cu succes.' });
    }
    else {
        res.status(404).json({ message: 'Eroare la stergerea francizei.' });
    }
});

aplicatie.listen(process.env.PORT);
