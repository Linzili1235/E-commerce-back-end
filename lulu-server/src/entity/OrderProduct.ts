import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinTable,
    ManyToOne, ManyToMany
} from "typeorm"
import {Min} from "class-validator";
import {User} from "./User";
import {Product} from "./Product";
import {JoinColumn} from "typeorm/browser";

// annotation 注释写法
@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    order_id: number

    @Column('decimal', {precision:5, scale:2})
    @Min(0)
    price: number

    @Column('decimal', {precision:6, scale:2})
    @Min(0)
    total: number

    @Column('decimal', {precision:5, scale:2, default: 1.00})
    @Min(1)
    taxRate: number

    @Column({nullable: true, default: false})
    isDelete: boolean

    // 一个订单只能归于一个用户
    @ManyToOne(() => User, user => user.orders)
    @JoinColumn({name: "user_id"})
    user: User

    // Many-to-many with Product 多个订单包含多个产品
    // each column should contain atomic values
    // the principles of database normalization --- First Normal Form

    // the product_id and order_id columns contain foreign keys that reference the primary key columns in the Product and Order tables
    // product_id	order_id	quantity
    //    1	            1	        2
    //    2	            1	        1
    //    3	            2	        1
    //    1	            3	        3
    //    3	            3	        2
    
    @ManyToMany(() => Product)
    @JoinTable()
    //This field does not store actual values in the database directly. Instead, it's a representation of the
    //many-to-many relationship between Order and Product.
    products: Product[]     // product_id array

    @Column()
    @CreateDateColumn()
    createdAt: Date

    @Column()
    @UpdateDateColumn()
    updatedAt: Date


}
