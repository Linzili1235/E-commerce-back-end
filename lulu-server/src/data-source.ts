import "reflect-metadata"
import { DataSource, DataSourceOptions } from "typeorm"
import { SeederOptions } from 'typeorm-extension';

const options: DataSourceOptions & SeederOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "XMMxdwnkt547",
    database: "lulu",

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