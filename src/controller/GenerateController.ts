import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from 'express'
import { Controller } from '../decorator/Controller'
import { Route } from '../decorator/Route'
import { ComfyUtils } from '../utils/ComfyUtils'
import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'

const delay = promisify(setTimeout)

const comfyui = new ComfyUtils()

@Controller('/generate')
export class GenerateController {
  @Route('POST')
  async generate (req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      console.log('before')
      const workflowData = req.body
      let imgfn = workflowData.prefix
      imgfn = imgfn.substring(0, 100)
      console.log(imgfn)
      let imagepaths: string[] = await comfyui.getImagesWithName(imgfn)
      const ogImgCount: number = imagepaths.length

      console.log(ogImgCount)

      let fn = await comfyui.generate(workflowData) // Wait for the filename

      fn = this.formatSTR(fn)

      console.log(fn)

      let doneWaiting = false

      imagepaths = await comfyui.getImagesWithName(imgfn)
      let hasBeenAdded: number = imagepaths.length

      while (hasBeenAdded !== ogImgCount + 1) {
        console.log('<--- WAITING --->')
        await delay(400)
        imagepaths = await comfyui.getImagesWithName(imgfn)
        hasBeenAdded = imagepaths.length
        doneWaiting = hasBeenAdded === ogImgCount + 1
      }

      if (doneWaiting) {
        console.log('EXISTS: ---> ' + fn)

        console.log(imagepaths[imagepaths.length - 1])
        // Get the filename after the format has been applied
        const genImgPath: string = imagepaths[imagepaths.length - 1]

        console.log('GIP: ---> ' + genImgPath)
        // Copy the file to the images folder and get the relative path for client-side use

        const sourcePath = `D:/ComfyUI/ComfyUI/output/${genImgPath}`

        const destPath = `D:/GitHub/chakreact-backend/src/images/${genImgPath}` // Ensure your project structure matches this path

        const copyFile = async (src: string, dest: string): Promise<void> => {
          fs.copyFileSync(src, dest)
          console.log(`File copied from ${src} to ${dest}`)
        }

        await copyFile(sourcePath, destPath)

        console.log(`File copied to ${destPath}`)

        //

        await delay(1000)

        // Log the results
        console.log('GENIMG: ---> ' + genImgPath)
        // console.log('RELATIVE: ---> ' + relativePath)

        res.status(200).json({
          message: 'Generation successful',
          path: `images/${genImgPath}` // Send the relative path to the front end
        })
      }
    } catch (error) {
      console.error('Generation failed:', error)
      res.status(500).json({
        message: 'Generation failed',
        error: error.message
      })
    }
  }

  formatSTR (str: any): string {
    str = str.replaceAll(', ', '_')
    str = str.replaceAll(',', '_')
    str = str.replaceAll(' ', '_')
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return str + ''
  }
}
