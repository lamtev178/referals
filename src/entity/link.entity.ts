import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Refer } from "./refer.entity";
import { User } from "./user.entity";

@Entity()
export class Link {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  sale: number;
  @ManyToOne(() => User, (user) => user.id)
  user: User;
  @OneToMany(() => Refer, (refer) => refer.link)
  referes: Refer[];
}
