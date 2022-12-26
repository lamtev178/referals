import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Link } from "./link.entity";

@Entity()
export class Refer {
  @PrimaryColumn()
  id: number;
  @ManyToOne(() => Link, (link) => link.id)
  link: Link;
}
