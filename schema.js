const { gql } = require('apollo-server-express');

const schema = gql`
# Les lignes qui commencent par # ou " sont des commentaires

# Ceci est le schéma de représentation de nos données.
# Il va servir de structure à notre API GraphQL

# On va commencer par définir des "entités"

"""
Un post sur le blog
"""
type Post {
    # Chaque propriété à un nom et un type
    # On peut rajouter à un type un modificateur
    id: ID! # Le modificateur ! indique que cette donnée est NOT NULL

    "Technical name for URL"
    slug: String!

    title: String!

    excerpt: String

    content: String

    # Je vais pouvoir décrire des liens entre mes entités
    category: Category!
}

"""
Une categorie regroupant plusieurs posts
"""
type Category {
    id: ID!

    label: String!

    route: String!

    posts: [Post]
    # Le modificateur [] indique que c'est une liste d'item de type Post
}

# On finit notre schéma par un type spécial
# Le type Query
# Il s'agirat des "points d'entrées" pour demander des données

type Query {
    "Renvoi toutes les categories du sites"
    categories: [Category]

    "Revoi un post par son ID"
    post(id: ID!): Post
}

# Les mutations sont les requêtes d'écriture (Création, modification, suppression) de GraphQL
type Mutation {
    # Les mutations renvoient aussi des données
    insertPost(slug: String!, title: String!, category_id: ID!): Post
    # Il est possible de définir un type custom pour éviter de passer tt les param. un à un
    # https://graphql.org/graphql-js/mutations-and-input-types/

}
`;

// Le schéma a vraiment un role central dans les API GraphQL
// Car il sert à la fois
// - De documentation
// - De routeur
// - De validation

module.exports = schema;