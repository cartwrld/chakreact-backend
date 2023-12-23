import { NextFunction, Request, Response } from 'express'
import { Controller } from '../decorator/Controller'
import { Route } from '../decorator/Route'
import { ComfyUtils } from '../utils/ComfyUtils'
import * as fs from 'fs'
import { promisify } from 'util'
import { Workflow } from '../entity/Workflow'
import { AppDataSource } from '../data-source'
import { validate, ValidationError, ValidatorOptions } from 'class-validator'
import { ObjectLiteral } from 'typeorm'

const delay = promisify(setTimeout)

const comfyui = new ComfyUtils()

@Controller('/generate')
export class GenerateController {
  private readonly workflowRepo = AppDataSource.getRepository(Workflow)

  private readonly validOptions: ValidatorOptions = {
    stopAtFirstError: true,
    skipMissingProperties: false,
    validationError: {
      target: false,
      value: false
    }
  }

  @Route('POST')
  async create (req: Request, res: Response, next: NextFunction): Promise<any> {
    const wf = req.body
    const newWF = new Workflow(wf.version, wf.pos_prompt, wf.neg_prompt, this.trimCKPTBeforeDB(wf.ckpt), wf.seed, wf.steps, wf.cfg,
      wf.sampler, wf.scheduler, wf.width, wf.height, wf.prefix
    )

    try {
      const wfObj = req.body

      console.log(wfObj)

      let imgfn = wfObj.prefix
      imgfn = imgfn.substring(0, 100)

      let imagepaths: string[] = await comfyui.getImagesWithName(imgfn)
      const ogImgCount: number = imagepaths.length

      let fn = await comfyui.generate(wfObj) // Wait for the filename

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
        await delay(200)

        imagepaths = await comfyui.getImagesWithName(imgfn)
        hasBeenAdded = imagepaths.length
        doneWaiting = hasBeenAdded === ogImgCount + 1
      }

      if (doneWaiting) {
        console.log('<--- RENDERED --->')
        const genImgPath: string = imagepaths[imagepaths.length - 1]
        const sourcePath = `D:/ComfyUI/ComfyUI/output/${genImgPath}`
        const destPath = `D:/GitHub/chakreact-backend/src/images/${genImgPath}` // Ensure your project structure matches this path

        const charcode = this.charCode()
        const copyFile = async (src: string, dest: string): Promise<void> => {
          let subsrc = src.substring(0, src.indexOf('.png'))
          subsrc += charcode + '.png'
          await delay(500)
          fs.copyFileSync(src, subsrc)
        }
        await copyFile(sourcePath, destPath)

        await delay(250)
        const moveFile = async (src: string, dest: string): Promise<void> => {
          fs.renameSync(src, dest)
        }

        await moveFile(sourcePath, destPath)

        await delay(250)

        await this.validateAndAddWF(res, newWF, genImgPath)

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

  trimCKPTBeforeDB (ckpt): string {
    return ckpt.replace('.safetensors', '')
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

  async validateAndAddWF (res: any, newWF: Workflow, pathname: string): Promise<void> {
    newWF.pathname = pathname

    const violations = await validate(newWF, this.validOptions)

    const checkVio = async (): Promise<ValidationError[] | Workflow & ObjectLiteral> => {
      if (violations.length) {
        res.statusCode = 422 // Unprocessable Entity
        return violations
      } else {
        console.log('no vios')
        return await this.workflowRepo.save(newWF)
      }
    }
    const vios = await checkVio()
    console.log(vios)
    console.log('Successfully added { x } to database')
  }
}
