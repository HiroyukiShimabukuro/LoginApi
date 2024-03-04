import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

async function query(queryObject: string, params?: any) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  });

  await client.connect();

  const queryBuild = {
    text: queryObject,
    values: params,
  };

  const result = await client.query(queryBuild);

  await client.end();
  return result;
}

export default {
  query: query,
};
