import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Workflow } from './entity/Workflow'

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'sqlite.db',
  synchronize: true,
  logging: false,
  entities: [Workflow],
  migrations: [],
  subscribers: []
})
