
module.exports = {
    // On suit ici la structure du schéma
    // Mon schéma à un type query
    Query: {
        // Qui à une propriété "categories"
        // Pour lui "expliquer" comment répondre à cette demande je fais une fonction
        async categories(_, __, context) {
            return await context.dataSources.category.findAllCategories();
        },

        // Le second paramètre correspond aux arguments passé à mon point d'entrée
        async post(_, args, context) {
            return await context.dataSources.post.findPostById(args.id);
        }
    },

    Mutation: {
        async insertPost(_, args, context) {
            return await context.dataSources.post.insertPost(args);
        }
    },

    Category: {
        // Le premier param des résolvers est le "parent"
        // Lorsque la requête demande les "posts" d'une "Category"
        // Apollo va venir exécuter ce resolver afin de les récupérer
        // Pour que le resolver récupère les posts de la bonne Category
        // il la passe en param en tant que "parent"
        async posts(category, _, context) {
            // parent ici est un objet Category
            // il a une propriété id
            const categoryId = category.id;
            return await context.dataSources.post.findPostsByCategoryId(categoryId);
        }
    },

    Post: {
        async category(post, _, context) {
            return await context.dataSources.category.findCategoryById(post.category_id);
        }
    }
}