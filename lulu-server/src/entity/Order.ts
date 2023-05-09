import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne, OneToMany,
    JoinColumn
} from "typeorm"
import {Min} from "class-validator";
import {User} from "./User";
import {OrderProduct} from "./OrderProduct";
import {OrderStatus} from "./OrderStatus";
import {v4 as uuidv4} from 'uuid'
// annotation 注释写法
@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    order_id: number


    @Column({ unique: true })
    orderNumber: string;

    // You can generate and assign the transaction number in the entity constructor or before saving
    constructor() {
        this.orderNumber = `TXN-${uuidv4()}`;
    }

    @Column('decimal', {precision:6, scale:2})
    @Min(0)
    total: number

    @Column({nullable: false})
    // document payment id elsewhere
    payment: number

    @Column({nullable: false})
    shippingAddress: string

    // 一个订单只能归于一个用户
    @ManyToOne(() => User, user => user.orders)
    @JoinColumn({name: 'user_id'})
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
    @OneToMany(() => OrderProduct, orderProduct => orderProduct.order)
    //This field does not store actual values in the database directly. Instead, it's a representation of the
    //many-to-many relationship between Order and Product.
    orderProducts: OrderProduct[]     // product_id array

    @OneToMany(()=> OrderStatus, orderStatus => orderStatus.order)
    orderStatus: OrderStatus[]

    @Column({default: false})
    isDelete: boolean

}
