import { PrimaryKey, Entity, Property } from '@mikro-orm/core';

@Entity()
export class Estate {

  @PrimaryKey({ hidden: true })
  id!: number;

  @Property()
  name: string;

  @Property()
  image: string;

  @Property()
  createdAt = new Date();

  constructor(name: string, image: string) {
    this.name = name;
    this.image = image;
  }

}