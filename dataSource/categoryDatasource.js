const { DataSource } = require('apollo-datasource');
const DataLoader = require('dataloader');

class CategoryDataSource extends DataSource {

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

    async findAllCategories() {
        const result = await this.client.query('SELECT * FROM category');
        return result.rows;
    }

    async findCategoryById(categoryId) {
        console.log(`-- Adding ${categoryId} to category dataloader`);
        return await this.categoriesLoader.load(categoryId);
    }

    // Le constructeur de dataLoader reçoit une fonction
    // qui a pour paramètre une liste d'élément à récupérer
    categoriesLoader = new DataLoader(async (ids) => {
        console.log('Running batch function categoriesLoader with', ids);
        // Dans mon loader
        // Je dois trouver un moyen de récupérer les categories correspondants
        // aux id qui me sont donnés

        // On fait une requête SQL pour récupérer un batch de catégorie
        const result = await this.client.query(
            'SELECT * FROM category WHERE id = ANY($1)',
            [ids]);

        // La fonction ANY ne garantie pas d'ordre on va donc s'assurer de regroupe
        // nos categorie sous la forme d'une tableau
        const data = ids.map(id => {
            // Je prend le tableau d'id qui m'est passé en paramètre
            // je cherche dans le résultat de ma requête SQL
            // les categories correspondantes histoire d'assurer l'ordre
            return result.rows.find( category => category.id == id);
        });

        return data;
    });
}

module.exports = CategoryDataSource;