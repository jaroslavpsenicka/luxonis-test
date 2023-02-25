import { PrimaryKey, Entity, Property } from '@mikro-orm/core';

@Entity()
export class Estate {

  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @Property()
  image: string;

  @Property()
  createdAt = new Date();

  constructor(id: number, name: string, image: string) {
    this.id = id;
    this.name = name;
    this.image = image;
  }

}