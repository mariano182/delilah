const express = require('express');
const bodyParser = require('body-parser');
const db = require('../configuracion.js');
const Sequelize = require('sequelize');
const sql = new Sequelize('mysql://' + db.user + ':' + db.password + '@' + db.url + ':' + db.port + '/delilah');
const middlewares = require('../middlewares/middlewares.js');
const router = express.Router();



router.use(bodyParser.json());

router.post('/', middlewares.verificarToken, (req, res) => {
    let userToken = req.headers.authorization.split(' ')[1];
    let newOrder = req.body;
    if (newOrder.detallePedido != undefined && newOrder.formaPago != undefined && newOrder.total != undefined) {
        sql.query('SELECT id FROM users WHERE token = ?', { replacements: [userToken], type: sql.QueryTypes.SELECT }).then((user) => {
            if (user.length > 0) {
                let idUser = user[0].id;
                let stateOrder = "nuevo";
                let timeOrder = new Date();
                sql.query('INSERT INTO pedidos (user_id, estado, medio_de_pago, total, fecha_y_hora) VALUES (?, ?, ?, ?, ?)', { replacements: [idUser, stateOrder, newOrder.formaPago, newOrder.total, timeOrder], type: sql.QueryTypes.INSERT }).then((result) => {
                    let idPedido = result[0];
                    let valuesDetails = '';
                    for (order of newOrder.detallePedido) {
                        if (valuesDetails == '') {
                            valuesDetails += '(' + idPedido + ', ' + order.id + ', ' + order.cantidad + ')';
                        } else {
                            valuesDetails += ', (' + idPedido + ', ' + order.id + ', ' + order.cantidad + ')';
                        }
                    }
                    sql.query('INSERT INTO detallesPedidos (pedido_id, producto_id, cantidad) VALUES ' + valuesDetails, { type: sql.QueryTypes.INSERT }).then(() => {
                        res.status(200).json({ msg: 'Su pedido fue enviado con exito', rta: idPedido })
                    })
                })
            } else {
                res.status(404).json({ error: 'No existe ningun usuario con esa identificación' })
            }
        })
    } else {
        res.status(404).json({ error: 'El pedido es invalido' })
    }
})

router.get('/', middlewares.verificarToken, middlewares.verificarAdm, (req, res) => {
    sql.query('SELECT p.estado, p.fecha_y_hora, p.id AS numeroOrden, CONCAT(dp.cantidad, "X", (SELECT descripcion FROM productos WHERE dp.producto_id = productos.id)) AS descripcion, IF(p.medio_de_pago = 0, "efectivo", "tarjeta") AS formaPago, p.total, CONCAT(u.name, " ", u.lastName) AS user, u.address FROM detallesPedidos AS dp JOIN pedidos AS p ON dp.pedido_id = p.id JOIN users AS u ON p.user_id = u.id', { type: sql.QueryTypes.SELECT }).then((rows) => {
        if (rows.length > 0) {
            res.status(200).json({ msg: 'Pedidos en Delilah Restó', rta: rows })
        } else {
            res.status(200).json({ error: 'No existe la lista de pedidos' })
        }
    })
})

router.get('/:id', middlewares.verificarToken, middlewares.verificarAdm, (req, res) => {
    let idPedido = req.params.id;
    sql.query('SELECT p.estado, p.fecha_y_hora, p.id AS numeroOrden, CONCAT(dp.cantidad, "X", (SELECT descripcion FROM productos WHERE dp.producto_id = productos.id)) AS descripcion, IF(p.medio_de_pago = 0, "efectivo", "tarjeta") AS formaPago, p.total, CONCAT(u.name, " ", u.lastName) AS user, u.address FROM detallesPedidos AS dp JOIN pedidos AS p ON dp.pedido_id = p.id JOIN users AS u ON p.user_id = u.id WHERE p.id = ?', { replacements: [idPedido], type: sql.QueryTypes.SELECT }).then((rows) => {
        if (rows.length > 0) {
            res.status(200).json({ msg: 'Pedidos en Delilah Restó', rta: rows })
        } else {
            res.status(200).json({ error: 'No existe la lista de pedidos' })
        }
    })
})


router.put('/:id', middlewares.verificarToken, (req, res) => {
    let userToken = req.headers.authorization.split(' ')[1];
    let idOrder = req.params.id;
    let orderState = req.body.estadoPedido.toLowerCase();
    sql.query('SELECT * FROM users WHERE token = ?', { replacements: [userToken], type: sql.QueryTypes.SELECT }).then((user) => {
        if (user.length > 0) {
            let adminUser = user[0].is_admin;
            if (!adminUser && orderState == "cancelado" || adminUser) {
                sql.query('UPDATE pedidos SET estado = ? WHERE id = ?', { replacements: [orderState, idOrder], type: sql.QueryTypes.UPDATE }).then(() => {
                    res.status(200).json({ msg: 'El pedido ha sido actualizado', rta: idOrder })
                })
            } else {
                res.status(404).json({ error: 'No posee permiso para realizar cambios' })
            }
        } else {
            res.status(404).json({ error: 'No hay ninguna usuario con esa identificación' })
        }
    })
})


module.exports = router;