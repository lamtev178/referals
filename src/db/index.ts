import { DataSource } from "typeorm";

export const dataBase = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: 9991,
  username: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "postgres",
  database: process.env.POSTGRES_BASE_NAME || "referals",
  synchronize: true,
  entities: ["src/entity/*.entity.ts"],
});
