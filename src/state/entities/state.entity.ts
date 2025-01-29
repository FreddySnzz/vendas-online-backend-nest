import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { CityEntity } from "src/city/entities/city.entity";

@Entity({ name: 'state' })
export class StateEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;
  
  @Column({ name: 'name', nullable: false })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => CityEntity, (city) => city.state)
  cities?: CityEntity[];
}