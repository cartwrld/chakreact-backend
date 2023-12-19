import { NextFunction, Request, Response } from 'express'
import { Controller } from '../decorator/Controller'
import { Route } from '../decorator/Route'
import { ComfyUtils } from '../utils/ComfyUtils'
import * as fs from 'fs'
import { promisify } from 'util'
import * as sharp from 'sharp'
import { all } from 'axios'

const delay = promisify(setTimeout)

const comfyui = new ComfyUtils()

@Controller('/history')
export class HistoryController {
  @Route('GET')
  async history (req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const imageFolder = 'D:/GitHub/chakreact-backend/src/images'
      let imgPaths: string[] = []

      const gatherFiles = async (): Promise<void> => {
        imgPaths = fs.readdirSync(imageFolder)
      }
      await gatherFiles()

      const formattedPaths = []

      for (let i = 0; i < imgPaths.length; i++) {
        let str = ''
        for (let j = 0; j < imgPaths[i].length; j++) {
          const char = imgPaths[i].charAt(j)
          if (char !== '"' && char !== '\\' && char !== '[' && char !== ']') {
            str += char
          }
        }
        formattedPaths.push(str)
      }

      res.status(200).json({
        message: 'History retrieval successful',
        paths: JSON.stringify(formattedPaths)
      })
    } catch (error) {
      console.error('History retrieval failed:', error)
      res.status(500).json({
        message: 'History retrieval failed',
        error: error.message
      })
    }
  }

  @Route('GET', '/square')
  async square (req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const imageFolder = 'D:/GitHub/chakreact-backend/src/images'
      const imgPaths: string[] = fs.readdirSync(imageFolder)
      const squareImages: string[] = []

      for (const imgPath of imgPaths) {
        const imagePath = `${imageFolder}/${imgPath}`
        const image = sharp(imagePath)

        const metadata = await image.metadata()
        if (metadata.width === metadata.height) {
          squareImages.push(imgPath) // This image is a square
        }
      }

      res.status(200).json({
        message: 'Generation successful',
        squarePaths: squareImages // Send only the paths of square images
      })
    } catch (error) {
      console.error('Generation failed:', error)
      res.status(500).json({
        message: 'Generation failed',
        error: error.message
      })
    }
  }

  @Route('GET', '/portrait')
  async portrait (req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const imageFolder = 'D:/GitHub/chakreact-backend/src/images'
      const imgPaths: string[] = fs.readdirSync(imageFolder)
      const portraitImages: string[] = []

      for (const imgPath of imgPaths) {
        const imagePath = `${imageFolder}/${imgPath}`
        const image = sharp(imagePath)

        const metadata = await image.metadata()
        if (metadata.width < metadata.height) {
          portraitImages.push(imgPath) // This image is a square
        }
      }

      res.status(200).json({
        message: 'Generation successful',
        portraitPaths: portraitImages // Send only the paths of square images
      })
    } catch (error) {
      console.error('Generation failed:', error)
      res.status(500).json({
        message: 'Generation failed',
        error: error.message
      })
    }
  }
  @Route('GET', '/landscape')
  async landscape (req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const imageFolder = 'D:/GitHub/chakreact-backend/src/images'
      const imgPaths: string[] = fs.readdirSync(imageFolder)
      const landscapeImages: string[] = []

      for (const imgPath of imgPaths) {
        const imagePath = `${imageFolder}/${imgPath}`
        const image = sharp(imagePath)

        const metadata = await image.metadata()
        if (metadata.width > metadata.height) {
          landscapeImages.push(imgPath) // This image is a square
        }
      }

      res.status(200).json({
        message: 'Generation successful',
        landscapePaths: landscapeImages // Send only the paths of square images
      })
    } catch (error) {
      console.error('Generation failed:', error)
      res.status(500).json({
        message: 'Generation failed',
        error: error.message
      })
    }
  }
}
