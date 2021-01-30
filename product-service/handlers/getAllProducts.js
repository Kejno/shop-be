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

export const getAllProducts = async () => {

  const client = new Client(dbOptions)
  await client.connect()

  try {

    const { rows: products } = await client.query(`select products.*, stocks.count FROM products LEFT JOIN stocks ON stocks.product_id=products.id`)

    return {
      statusCode: 200,
      body: JSON.stringify({
        products,
        count: products.length
      }),
    };
  } catch (error) {
    console.error('Error durring database request executing: ',error)
  } finally {
    client.end()
  }

};
