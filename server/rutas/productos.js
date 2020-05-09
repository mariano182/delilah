const express = require('express');
const bodyParser = require('body-parser');
const db = require('../configuracion.js');
const Sequelize = require('sequelize');
const sql = new Sequelize('mysql://' + db.user + ':' + db.password + '@' + db.url + ':' + db.port + '/delilah');
const middlewares = require('../middlewares/middlewares.js');
const router = express.Router();



router.use(bodyParser.json());


router.get('/', middlewares.verificarToken, (req, res) => {

    sql.query('SELECT * FROM productos', { type: sql.QueryTypes.SELECT }).then((rowsProductos) => {
        if (rowsProductos.length == 0) {
            res.status(200).json({ error: 'No hay productos en la lista' })
        } else {
            res.status(200).json({ msg: 'Productos buscados en Delilah Resto', listaProductos: rowsProductos })
        }
    })
})


router.get('/:id', middlewares.verificarToken, (req, res) => {

    let idproducto = req.params.id;

    sql.query('SELECT * FROM productos WHERE id = ?', { replacements: [idproducto], type: sql.QueryTypes.SELECT }).then((rowsProductos) => {
        if (rowsProductos.length == 0) {
            res.status(200).json({ error: 'No hay productos en la lista que estan identificados con ese nombre' })
        } else {
            res.status(200).json({ msg: 'Producto encontrado en Delilah Resto', listaProductos: rowsProductos[0] })
        }
    })
})


router.post('/', middlewares.verificarToken, middlewares.verificarAdm, (req, res) => {

    let ProductoNuevo = req.body;

    if (ProductoNuevo != undefined && ProductoNuevo.descripcion != undefined && ProductoNuevo.ingredientes != undefined && ProductoNuevo.costo != undefined && ProductoNuevo.img != undefined) {
        sql.query('INSERT INTO productos (nombre, descripcion, ingredientes, costo, img ) VALUES (?, ?, ?, ?, ?)', { replacements: [ProductoNuevo.nombre, ProductoNuevo.descripcion, ProductoNuevo.ingredientes, ProductoNuevo.costo, ProductoNuevo.img], type: sql.QueryTypes.INSERT }).then(() => {
            res.status(200).json({ msg: 'El producto fue creado con exito', rta: ProductoNuevo })
        })
    } else {
        res.status(404).json({ error: 'El producto es invalido' })
    }
})


router.put('/:id', middlewares.verificarToken, middlewares.verificarAdm, (req, res) => {


    let idproducto = req.params.id;
    let ProductoNuevo = req.body;


    sql.query('SELECT * FROM productos WHERE id = ?', { replacements: [idproducto], type: sql.QueryTypes.Select }).then((producto) => {
        if (producto.length > 0) {

            if (ProductoNuevo.nombre != undefined && ProductoNuevo.descripcion != undefined && ProductoNuevo.ingredientes != undefined && ProductoNuevo.costo != undefined && ProductoNuevo.img != undefined) {

                sql.query('UPDATE productos SET nombre = ?, descripcion =?, ingredientes = ?, costo = ?, img =? WHERE id = ?', { replacements: [ProductoNuevo.nombre, ProductoNuevo.descripcion, ProductoNuevo.ingredientes, ProductoNuevo.costo, ProductoNuevo.img, idproducto], type: sql.QueryTypes.UPDATE }).then(() => {
                    res.status(200).json({ msg: "El producto fue actualizado correctamente", rta: ProductoNuevo })
                })

            } else {
                res.status(404).json({
                    error: " Los datos son invalidos"
                })
            }
        } else {
            res.status(400).json({ error: "El producto que estas intentado actualizar no existe" })
        }
    })

})


router.delete('/:id', middlewares.verificarToken, middlewares.verificarAdm, (req, res) => {

    let idproducto = req.params.id;

    sql.query('SELECT * FROM productos WHERE id = ?', { replacements: [idproducto], type: sql.QueryTypes.SELECT }).then((producto) => {
        if (producto.length > 0) {
            sql.query('DELETE FROM productos WHERE id = ?', { replacements: [idproducto], type: sql.QueryTypes.DELETE }).then(() => {
                res.status(200).json({ msg: 'El producto fue eliminado con exito', rta: producto[0] })
            })
        } else {
            res.status(200).json({ error: 'No hay ningun producto identificado con ese nombre' })
        }
    })
})


module.exports = router;