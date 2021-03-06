const express = require('express');
const Usuario = require('../models/usuario');
const mdAutenticacion = require('../middlewares/autenticacion');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();

app.get('/usuario', mdAutenticacion.verificaToken, function(req, res) {
    /* return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email
    }); */

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: err
                });
            }
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                });
            });
        });
});
app.post('/usuario', [mdAutenticacion.verificaToken, mdAutenticacion.verificaAdminRole], function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuariodb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }
        // usuariodb.password = null;
        res.json({
            ok: true,
            usuario: usuariodb
        });
    });
});
app.put('/usuario/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaAdminUsuario], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre',
        'email',
        'img',
        'role',
        'estado'
    ]);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuariodb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }
        res.json({
            ok: true,
            usuario: usuariodb
        });
    });

});
app.delete('/usuario/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaAdminRole], function(req, res) {
    let id = req.params.id;
    /* Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }
        if (usuarioBorrado === null) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Usuario no encontrado' }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    }); */

    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }
        if (usuarioBorrado === null) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Usuario no encontrado' }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;