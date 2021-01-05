const { Pool } = require('pg');

const pool = new Pool();

// On va créer un wrapper
// Une "enveloppe" autour de la méthode query du pool
// On va s'en servir pour faire des console.log de nos requêtes
module.exports = {
    query(...params) { // Je pack les paramètres en un seul tableau

        console.log('SQL :', ...params);
        console.count('Req SQL n°');

        // et ainsi j'unpack le tableau en plusieurs arguments
        // pour appeler la méthode query exactement comme j'ai été appelé
        return pool.query(...params);
    }
};