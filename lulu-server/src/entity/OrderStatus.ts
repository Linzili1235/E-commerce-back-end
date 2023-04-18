import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne
} from "typeorm"
import {Order} from "./Order";

// annotation 注释写法
@Entity()
export class OrderStatus {

    @PrimaryGeneratedColumn()
    order_status_id: number

    @Column()
    // document status dict elsewhere
    status: number

    // 一个订单只能归于一个用户
    @ManyToOne(() => Order, order => order.orderStatus)
    @JoinColumn({name: 'order_id'})
    order: Order



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

    @Column()
    @CreateDateColumn()
    createdAt: Date

    @Column()
    @UpdateDateColumn()
    updatedAt: Date


}
