import "reflect-metadata"
import { DataSource, DataSourceOptions } from "typeorm"
import { SeederOptions } from 'typeorm-extension';

const options: DataSourceOptions & SeederOptions = {
    type: "postgres",
    host: "dpg-cibphsd9aq03rjgpmhp0-a",
    port: 5432,
    username: "nicole",
    password: process.env.PASSWORD,
    database: "railway_idsv",

    synchronize: true,
    logging: false,
    entities: [
        "src/entity/**/*.ts"
    ],
    migrations: [
        "src/migrations/**/*.ts"
    ],
    subscribers: [
        "src/subscribers/**/*.ts"
    ],
    seeds: ['src/db/seeds/**/*{.ts,.js}'],
    factories: ['src/db/factories/**/*{.ts,.js}']
}
export const AppDataSource = new DataSource(options);