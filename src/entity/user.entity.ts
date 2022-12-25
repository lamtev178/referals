import { Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Link } from "./link.entity";

@Entity()
export class User {
  @PrimaryColumn()
  id: number;
  @OneToMany(() => Link, (link) => link.user)
  links: Link[];
}
