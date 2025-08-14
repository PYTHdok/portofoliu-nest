import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Lucrare {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  descriere: string;

  @Column({ nullable: true })
  link_client?: string;

  @Column({ default: 'visible' })
  status: 'visible' | 'hidden';

  @Column()
  imagePath: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}