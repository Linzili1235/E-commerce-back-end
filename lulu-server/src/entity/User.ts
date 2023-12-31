import {Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToMany} from "typeorm"
import {IsEmail, Length} from "class-validator";
import {Order} from "./Order";

// annotation 注释写法
@Entity()
@Unique(['email'])
export class User {

    @PrimaryGeneratedColumn()
    user_id: number

    @Column()
    @Length(1, 100)
    firstName: string

    @Column()
    @Length(1, 100)
    lastName: string

    @Column()
    @IsEmail()
    @Length(5,150)
    email: string

    @Column()
    @Length(6,100)
    password: string

    @Column({nullable: true})
    refreshToken: string

    @Column({nullable: true, default: false})
    isStaff: boolean

    @Column({nullable: true, default: false})
    isActive: boolean

    @Column({nullable: true, default: false})
    isDelete: boolean

    @Column()
    @CreateDateColumn()
    createdAt: Date

    @Column()
    @UpdateDateColumn()
    updatedAt: Date

    // Relation, ONE-TO-MANY: user => order
    @OneToMany(() => Order, order => order.user)
    orders: Order[]
}
