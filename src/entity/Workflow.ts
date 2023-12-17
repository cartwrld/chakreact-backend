import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { IsOptional, Length, IsNotEmpty, IsIn, IsPositive, Max, Min, IsUrl } from 'class-validator'

@Entity()
export class Workflow {
  @PrimaryGeneratedColumn()
  @IsOptional()
    wfID: number

  @IsNotEmpty({ message: 'You must input a valid ckpt' })
    ckpt: string

  @IsNotEmpty({ message: 'You must input a valid prompt' })
    prompt: string

  @IsNotEmpty({ message: 'You must input a valid seed' })
    seed: number

  @IsNotEmpty({ message: 'You must input a valid step count' })
    steps: number

  @IsNotEmpty({ message: 'You must input a valid cfg' })
    cfg: number

  @IsNotEmpty({ message: 'You must input a valid sampler' })
    sampler: string

  @IsNotEmpty({ message: 'You must input a valid scheduler' })
    scheduler: string
}
