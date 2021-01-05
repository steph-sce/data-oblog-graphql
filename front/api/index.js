import queries from "./queries";

export default {
    endpoint: "http://localhost/graphql",
    // Ici c'est une fonction fetch qui sera utilisé dans mes requetes graph
    async fetch(query, variables, name) {
        const body = {
            query,
            variables,
            operationName: name,
        };

        // Ici c'est le fetch standard des navigateurs
        return fetch(this.endpoint, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => response.json());
    },
    ...queries,
};
