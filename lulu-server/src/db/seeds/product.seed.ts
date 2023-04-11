import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Product } from '../../entity/Product';

export default class ProductSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        const productFactory = await factoryManager.get(Product);
        // save 1 factory generated entity, to the database
        // await productFactory.save();
        console.log('seed', productFactory)
        // save 5 factory generated entities, to the database
        await productFactory.saveMany(5);
    }
}
