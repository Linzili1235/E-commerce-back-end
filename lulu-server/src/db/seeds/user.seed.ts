
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../../entity/User';
const bcrypt = require('bcrypt');

// seed command:
export default class UserSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        const repo =  dataSource.getRepository(User);
        // all users share the same hashedPassword
        const hashedPassword = await bcrypt.hash('lululemon', 10)
        // admin
        let user1 = new User()
        user1.firstName = 'Peidong'
        user1.lastName = 'He'
        user1.email = 'peidong@gmail.com'
        user1.password = hashedPassword
        user1.isStaff = true
        await repo.save(user1)
        // admin 2
        let user2 = new User()
        user2.firstName = 'Jing'
        user2.lastName = 'Yi'
        user2.email = 'jingyi@gmail.com'
        user2.password = hashedPassword
        user2.isStaff = true
        await repo.save(user2)
        // customer
        let user3 = new User()
        user3.firstName = 'Bill'
        user3.lastName = 'Xu'
        user3.email = 'bill@gmail.com'
        user3.password = hashedPassword
        await repo.save(user3)
    }
}
