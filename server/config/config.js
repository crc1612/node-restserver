//==============================
// Puerto
//==============================
process.env.PORT = process.env.PORT || 3000;


//==============================
// Entorno
//==============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==============================
// Base de datos
//==============================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;

//==============================
// Vencimiento del token
//==============================

process.env.CADUCIDAD_TOKEN = 60 * 60;

//==============================
// SEED de autotenticacion
//==============================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//==============================
// Google Client ID
//==============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '656820413272-52jnpjdt09mfqdtice8mk3m1ocngt9hj.apps.googleusercontent.com';