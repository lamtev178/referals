import { Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Link } from "./link.entity";

@Entity()
export class User {
  @PrimaryColumn()
  id: string;
  @OneToMany(() => Link, (link) => link.user)
  links: Link[];
}
