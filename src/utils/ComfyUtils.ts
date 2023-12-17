import { exec } from 'child_process'
import { existsSync, promises as fsPromises, writeFileSync } from 'fs'

import { Workflow } from '../entity/Workflow'
import { promisify } from 'util'
import { join } from 'path'
import * as fs from 'fs'

const delay = promisify(setTimeout)

export class ComfyUtils {
  async generate (workflowData: Workflow): Promise<unknown> {
    // const promptArr = ['photograph of a young woman standing in the rain, beautiful, long hair, looking at camera']
    // writeFileSync('prompts.json', JSON.stringify({ prompts: promptArr }));
    writeFileSync('props.json', JSON.stringify(workflowData))

    console.log('right before process call')

    const filename = await new Promise((resolve, reject) => {
      const genProcess = exec('python basic_workflow_api.py')

      genProcess.stdout.on('data', (data) => {
        console.log('====== python output data ======')
        console.log(data)
        console.log('================================')

        // Check if the Python script output contains the filename
        if (data.includes('FILENAME:')) {
          const filename = data.split('FILENAME:')[1].trim() // Extract the filename
          resolve(filename) // Resolve the promise with the filename
        }
      })

      genProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`)
        reject(new Error(data)) // Reject the promise on errors
      })

      genProcess.on('exit', (code) => {
        console.log(`Child exited with code ${code}`)
        if (code !== 0) {
          reject(new Error(`Child exited with code ${code}`)) // Reject the promise if exit code is not 0
        }
      })
    })
    return await Promise.resolve(filename)
  }

  async getImagesWithName (name: string): Promise<string[]> {
    const outputPath = 'D:/ComfyUI/ComfyUI/output'

    try {
      const files = await fsPromises.readdir(outputPath)
      return files.filter(file => file.includes(name))
    } catch (error) {
      console.error('An error occurred while reading the directory:', error)
      throw error // Rethrow the error to handle it in the calling function
    }
  }
}
