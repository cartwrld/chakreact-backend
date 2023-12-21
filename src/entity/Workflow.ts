import { Entity, PrimaryGeneratedColumn } from 'typeorm'
import { IsOptional, IsNotEmpty, IsNumber, IsString } from 'class-validator'

@Entity()
export class Workflow {
  constructor (
    version: string, posPrompt?: string, negPrompt?: string, ckpt?: string, seed?: number, steps?: number, cfg?: number,
    sampler?: string, scheduler?: string, width?: number, height?: number) {
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
  }

  @PrimaryGeneratedColumn()
  @IsOptional()
    wfID: number

  @IsString()
  @IsNotEmpty({ message: 'You must input a valid positive prompt' })
    pos_prompt: string

  @IsString()
    neg_prompt: string

  @IsString()
  @IsNotEmpty({ message: 'You must input a valid ckpt' })
    ckpt: string

  @IsNumber()
  @IsNotEmpty({ message: 'You must input a valid seed' })
    seed: number

  @IsNumber()
  @IsNotEmpty({ message: 'You must input a valid step count' })
    steps: number

  @IsNumber()
  @IsNotEmpty({ message: 'You must input a valid cfg' })
    cfg: number

  @IsNotEmpty({ message: 'You must input a valid sampler' })
    sampler: string

  @IsString()
  @IsNotEmpty({ message: 'You must input a valid scheduler' })
    scheduler: string

  @IsNumber()
  @IsNotEmpty({ message: 'You must input a valid width' })
    width: number

  @IsNumber()
  @IsNotEmpty({ message: 'You must input a valid height' })
    height: number

  @IsString()
  @IsNotEmpty({ message: 'You must input a valid version' })
    version: string
}
