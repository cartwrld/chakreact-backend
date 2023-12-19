import { NextFunction, Request, Response } from 'express'
import { Controller } from '../decorator/Controller'
import { Route } from '../decorator/Route'
import { ComfyUtils } from '../utils/ComfyUtils'
import * as fs from 'fs'
import { promisify } from 'util'

const delay = promisify(setTimeout)

const comfyui = new ComfyUtils()

@Controller('/generate')
export class GenerateController {
  @Route('POST')
  async generate (req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const workflowData = req.body
      let imgfn = workflowData.prefix
      imgfn = imgfn.substring(0, 100)

      let imagepaths: string[] = await comfyui.getImagesWithName(imgfn)
      const ogImgCount: number = imagepaths.length

      let fn = await comfyui.generate(workflowData) // Wait for the filename

      if (fn === '') fn = 'empty'

      fn = this.formatSTR(fn)

      let doneWaiting = false

      imagepaths = await comfyui.getImagesWithName(imgfn)
      let hasBeenAdded: number = imagepaths.length

      let count = 0

      while (hasBeenAdded !== ogImgCount + 1) {
        if (count++ > 200) {
          console.log('<--- NO IMG FOUND --->')
          break
        }

        console.log('<--- WAITING --->')
        await delay(100)

        imagepaths = await comfyui.getImagesWithName(imgfn)
        hasBeenAdded = imagepaths.length
        doneWaiting = hasBeenAdded === ogImgCount + 1
      }

      if (doneWaiting) {
        console.log('EXISTS: ---> ' + fn)

        const genImgPath: string = imagepaths[imagepaths.length - 1]

        const sourcePath = `D:/ComfyUI/ComfyUI/output/${genImgPath}`

        const destPath = `D:/GitHub/chakreact-backend/src/images/${genImgPath}` // Ensure your project structure matches this path

        const charcode = this.charCode()
        const copyFile = async (src: string, dest: string): Promise<void> => {
          let subsrc = src.substring(0, src.indexOf('.png'))
          subsrc += charcode + '.png'+
            await delay(500)
          fs.copyFileSync(src, subsrc)
        }
        await copyFile(sourcePath, destPath)

        await delay(500)
        const moveFile = async (src: string, dest: string): Promise<void> => {
          fs.renameSync(src, dest)
        }

        await moveFile(sourcePath, destPath)

        await delay(1000)

        res.status(200).json({
          message: 'Generation successful',
          path: `images/${genImgPath}` // Send the relative path to the front end
          // path: `D:/ComfyUI/ComfyUI/output/${genImgPath}` // Send the relative path to the front end
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

  charCode (): string {
    let cc = ''
    for (let i = 0; i < 6; i++) {
      const value = Math.floor(Math.random() * (3 - 1) + 1)
      value === 1
        ? Math.floor(Math.random() * (57 - 48) - 48)
        : value === 2
          ? Math.floor(Math.random() * (90 - 65) - 65)
          : Math.floor(Math.random() * (122 - 97) - 97)
      cc += value
    }
    return cc
  }

  formatSTR (str: any): string {
    str = str.replaceAll(', ', '_')
    str = str.replaceAll(',', '_')
    str = str.replaceAll(' ', '_')
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return str + ''
  }
}
