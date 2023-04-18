import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    OneToMany
} from "typeorm"
import { Length, Min} from "class-validator";
import {OrderProduct} from "./OrderProduct";

// annotation 注释写法
@Entity()
@Unique(['slug'])
export class Product {

    @PrimaryGeneratedColumn()
    product_id: number

    @Column()
    product_real_id: string

    @Column()
    @Length(1, 200)
    slug: string

    @Column()
    @Length(1, 200)
    name: string

    // @Column('decimal',{precision: 5, scale: 2})
    // @Min(0)
    // price: number

    @Column()
    price: string

    @Column()
    media: string

    @Column({nullable: false})
    color: string

    @Column({nullable: false})
    size: string

    @Column({nullable: true, default: false})
    isActive: boolean
    // Many-to-many relationship
    @OneToMany(() => OrderProduct, orderProduct => orderProduct.product)
    orderProducts: OrderProduct[]

    @Column({nullable: true, default: false})
    isDelete: boolean


}
