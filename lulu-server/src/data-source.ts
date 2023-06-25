import "reflect-metadata"
import { DataSource, DataSourceOptions } from "typeorm"
import { SeederOptions } from 'typeorm-extension';

const options: DataSourceOptions & SeederOptions = {
    type: "postgres",
    host: "containers-us-west-132.railway.app",
    port: 7335,
    username: "postgres",
    password: "OiEFzYOw0tlzBJberKL4",
    database: "railway",

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