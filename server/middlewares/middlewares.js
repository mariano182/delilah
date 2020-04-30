const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const sql = new Sequelize('mysql://root:12345678@localhost:3306/delilah');
const signature = 'PepeArgento';

function verificarToken(req, res, next) {
    const headers = req.headers.authorization;
    if (headers) {

        const token = headers.split(' ')[1];
        jwt.verify(token, signature, (err, data) => {
            if (err) {
                res.status(401).json({ error: 'Token invalido' });
            } else {
                console.log(data);
                next();
            }
        })
    } else {
        res.status(401).json({ error: 'Falta token' })
    }
}


function verificarAdm(req, res, next) {
    const headers = req.headers.authorization;
    const token = headers.split(' ')[1];

    sql.query('SELECT * FROM users WHERE token = ?', { replacements: [token], type: sql.QueryTypes.SELECT }).then((user) => {
        if (user.lenght == 0) {
            res.status(404).json({ error: 'No hay token para ese usuario' })
        } else {
            if (user[0].is_admin == 1) {
                next()
            } else {
                res.status(404).json({ error: 'Permiso denegado' })
            }
        }
    })
}

module.exports = { verificarToken: verificarToken, verificarAdm: verificarAdm }