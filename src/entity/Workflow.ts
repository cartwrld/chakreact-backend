import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { IsOptional, IsNotEmpty, IsNumber, IsString } from 'class-validator'
//
@Entity()
export class Workflow {
  constructor (
    version: string, posPrompt?: string, negPrompt?: string, ckpt?: string, seed?: number, steps?: number, cfg?: number,
    sampler?: string, scheduler?: string, width?: number, height?: number, prefix?: string) {
    this.version = version || 'SDXL'
    this.pos_prompt = posPrompt || 'empty'
    this.neg_prompt = negPrompt || ''
    this.ckpt = ckpt || 'dynavision_v0557.safetensors'
    this.seed = seed || 1234567890
    this.steps = steps || 20
    this.cfg = cfg || 6
    this.sampler = sampler || 'euler'
    this.scheduler = scheduler || 'karras'
    this.width = width || 1024
    this.height = height || 1024
    this.prefix = prefix || 'empty'
    this.pathname = ''
  }

  @PrimaryGeneratedColumn()
    wfID: number

  @Column()
  @IsString()
  @IsNotEmpty({ message: 'You must input a valid positive prompt' })
    pos_prompt: string

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
    neg_prompt: string

  @Column()
  @IsString()
  @IsNotEmpty({ message: 'You must input a valid ckpt' })
    ckpt: string

  @Column()
  @IsNumber()
    seed: number

  @Column()
  @IsNumber()
    steps: number

  @Column({ type: 'float' })
  @IsNumber()
    cfg: number

  @Column()
  @IsString()
  @IsNotEmpty({ message: 'You must input a valid sampler' })
    sampler: string

  @Column()
  @IsString()
  @IsNotEmpty({ message: 'You must input a valid scheduler' })
    scheduler: string

  @Column()
  @IsNumber()
    width: number

  @Column()
  @IsNumber()
    height: number

  @Column()
  @IsString()
  @IsNotEmpty({ message: 'You must input a valid version' })
    version: string

  @Column()
  @IsString()
    prefix: string

  @Column()
  @IsString()
    pathname: string
}
