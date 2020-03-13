const jwt = require('jsonwebtoken');

//=================================
// Verificar Token
//=================================

exports.verificaToken = (req, res, next) => {
    var token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        /* return res.json({
            usuario: req.usuario
        }); */
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
        /* res.json({
            token
        }); */
    });
};

//=================================
// Verificar AdminRole
//=================================

exports.verificaAdminRole = (req, res, next) => {
    var usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto - No es administrador',
            errors: { message: 'No es administrador, no puede realizar esta accion' }
        });
    }
};

exports.verificaAdminUsuario = (req, res, next) => {

    var usuario = req.usuario;
    var id = req.params.id;

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto - No es administrador',
            errors: { message: 'No es administrador, no puede realizar esta accion' }
        });
    }
};