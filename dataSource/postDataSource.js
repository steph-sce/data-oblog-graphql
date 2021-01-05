const { DataSource } = require('apollo-datasource');
const DataLoader = require('dataloader');

class PostDataSource extends DataSource {

    constructor() {
        super();
    }

    // Dans la DataSource on doit obligatoirement implémenter une méthode
    // initialize qui sera appelé par notre serveur apollo pour faire de
    // "l'injection de dépendance"
    initialize(config) {
        // config contiendra 2 propriété
        // - context qui servira à faire passer les dépendances
        // - cache pour la gestion interne
        this.context = config.context;
        this.client = config.context.sqlClient;
    }

    async findAllPosts() {
        const result = await this.client.query('SELECT * FROM post');
        return result.rows;
    }

    async findPostById(postId) {
        const result = await this.client.query('SELECT * FROM post WHERE id = $1', [postId]);

        if (result.rowCount === 0) {
            return undefined;
        }

        return result.rows[0];
    }

    async findPostsByCategoryId(categoryId) {
        console.log(`-- Adding ${categoryId} to post by category dataloader`);
        return await this.postsByCategoryLoader.load(categoryId);
    }

    async insertPost(post) {
        const savedPost = await this.client.query(
            `INSERT INTO post
                (slug, title, excerpt, content, category_id)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
             // Ne pas oublié le RETURNING dans ma requête car les mutations
             // renvoient aussi des données.
            [post.slug, post.title, post.excerpt, post.content, post.category_id]
             );

        return savedPost.rows[0];
    }

    // Si je recois [4, 3, 5]
    postsByCategoryLoader = new DataLoader(async (ids) => {
        console.log('Running batch function postsByCategoryLoader with', ids);

        // On fait une requête SQL pour récupérer un batch de catégorie
        const result = await this.client.query(
            'SELECT * FROM post WHERE category_id = ANY($1)',
            [ids]);

        // La fonction ANY ne garantie pas d'ordre on va donc s'assurer de regroupe
        // nos post sous la forme d'une tableau
        const data = ids.map(id => {
            // Je prend le tableau d'id qui m'est passé en paramètre
            // je cherche dans le résultat de ma requête SQL
            // les categories correspondantes histoire d'assurer l'ordre
            return result.rows.filter( post => post.category_id == id);
        });

        // Ici je dois renvoyer :
        // [
        //    [la liste des post de category_id 4 ],
        //    [la liste des post de category_id 3 ],
        //    [la liste des post de category_id 5 ]
        // ]
        return data;
    });
}

module.exports = PostDataSource;