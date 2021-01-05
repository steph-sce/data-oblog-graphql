require('dotenv').config();
const express = require('express');

const { ApolloServer } = require('apollo-server-express');
const schema = require('./schema');
const resolver = require('./resolver');
const client = require('./dataSource/client');
const dataSources = require('./dataSource');


const app = express();

// On va venir "créer" notre serveur GraphQL (comme on créérais un router ou l'app express)
const graphQLServer = new ApolloServer({
    // On lui donne le schema
    typeDefs: schema,
    // et les resolvers
    resolvers: resolver,

    // J'injecte dans le "context" notre client sql
    context: () => {
        // Cette méthode contexte renvoi un objet qui sera passé au DataSource
        // via leur méthode initialze (pour faire l'injection de dépendances)
        return {
            sqlClient: client
        };
    },

    // On donne nos dataSources à ApolloServer
    // Il va les "initialize" pour qu'elles récupère leurs dépendances
    // et il va les mettre à disposition des nos resolvers
    // /!\ dataSources à la même structure que context au dessus c'est une fonction
    // qui renvoi un objet !!!!
    dataSources: () => {
        return dataSources;
    }
    // équivalent
    // dataSources: () => dataSources

});

// Et ensuite on passe le middleware associé à express
// chargé sur la route /graphql
app.use(graphQLServer.getMiddleware());

app.listen(process.env.PORT || 3000, () => {
    console.log('Server running on :', process.env.PORT);
});