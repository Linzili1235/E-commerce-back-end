import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    ManyToOne
} from "typeorm"
import {Min} from "class-validator";
import {Product} from "./Product";
import {Order} from "./Order";

// annotation 注释写法
@Entity()
export class OrderProduct {

    @PrimaryGeneratedColumn()
    order_product_id: number

    @Column()
    @Min(1)
    quantity: number

    @Column('decimal', {precision:6, scale:2})
    @Min(0)
    price: number


    @ManyToOne(() => Order, order => order.orderProducts)
    @JoinColumn({name: "order_id"})
    order: Order

    @ManyToOne(() => Product, product => product.orderProducts)
    @JoinColumn({name: 'product_id'})
    //This field does not store actual values in the database directly. Instead, it's a representation of the
    //many-to-many relationship between Order and Product.
    product: Product


}
