import { Client } from 'pg'

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
const dbOptions = {
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 5000
}

export const createProduct = async (event) => {

    const client = new Client(dbOptions)
    await client.connect()

    const body = JSON.parse(event.body || '{}');

    const {
        name, image, description, brand, category, price, rating, numReviews, count
    } = body;

    try {
        const newProduct = await client.query(
            `INSERT INTO products(name, image, description, brand, category, price, rating, numReviews) values($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [name, image, description, brand, category, price, rating, numReviews]
        );

        const newProductStock = await client.query(`INSERT INTO stocks(count) values($1) RETURNING *`, [count]);

        return {
            statusCode: 201,
            body: JSON.stringify({...newProduct.rows[0], ...newProductStock.rows[0]}),
        };
    } catch (error) {
        console.error('Error durring database request executing: ', error)
    } finally {
        client.end()
    }

};
