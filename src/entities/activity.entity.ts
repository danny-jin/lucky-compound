import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, } from 'typeorm';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  beanRewards: string;

  @Column()
  miningPower: string;

  @Column()
  eggs: string;
}
