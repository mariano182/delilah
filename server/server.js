// VARIABLES
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const sql = new Sequelize('mysql://root:12345678@localhost:3306/delilah');

const productos = require('./rutas/productos.js');
const pedidos = require('./rutas/pedidos.js');


const signature = 'PepeArgento';

const app = express();



//ENDPOINTS
app.use(bodyParser.json());

app.use('/productos', productos);
app.use('/pedidos', pedidos);

app.post('/register', (req, res) => {

    const emailSent = req.body.email;
    if (emailSent != undefined) {

        sql.query('SELECT * FROM users WHERE email = ?', { replacements: [emailSent], type: sql.QueryTypes.SELECT }).then((user) => {
            if (user.length == 0) {
                const newUser = req.body;
                let newToken = jwt.sign({ userName: newUser.userName, fecha: +new Date() }, signature);
                console.log(newUser);
                sql.query('INSERT INTO users (userName, name, lastName, email, phone, address, password, token, is_admin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', { replacements: [newUser.userName, newUser.name, newUser.lastName, newUser.email, newUser.phone, newUser.address, newUser.password, newToken, false], type: sql.QueryTypes.INSERT }).then(() => {
                    res.status(200).json({ msg: 'Estas logueado!', token: newToken })
                })
            } else {
                res.status(404).json({
                    error: 'Ese email ya se encuentra registrado'
                })
            }
        })
    } else {
        res.status(404).json({
            error: 'El email es invalido'
        })
    }
})

app.post('/login', (req, res) => {
    const { name, password } = req.body;

    if (name != undefined && password != undefined) {

        sql.query('SELECT * FROM users WHERE (userName = "' + name + '" AND password = "' + password + '") OR (email = "' + name + '" AND password = "' + password + '")', { type: sql.QueryTypes.SELECT }).then((user) => {
            if (user.length == 0) {
                res.status(404).json({ error: 'El user o la contraseña es incorrecta' })
            } else {
                let newToken = jwt.sign({ userName: user.userName, fecha: +new Date() }, signature);
                sql.query('UPDATE users SET token = ? WHERE id = ' + user[0].id, { replacements: [newToken], type: sql.QueryTypes.UPDATE }).then(() => { res.status(200).json({ msg: 'Bienvenido a Delilah Resto', token: newToken }) })
            }
        })
    } else(
        res.status(404).json({
            error: 'Los datos son incorrectos'
        })
    )
})



app.listen(3000, function() {
    console.log('Server iniciado')
})