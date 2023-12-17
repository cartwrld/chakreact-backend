import { NextFunction, Request, Response } from 'express'
import { Controller } from '../decorator/Controller'
import { Route } from '../decorator/Route'
import { ComfyUtils } from '../utils/ComfyUtils'
import path from 'path'
import * as fs from 'fs'
const comfyui = new ComfyUtils()
@Controller('/checkimg')
export class CheckImageController {
  @Route('GET', '/checkimg')

  async checkImage (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const imagesDir = 'D:/ComfyUI/ComfyUI/output' // Adjust the path as necessary
      const imageName = req.params.imageName
      const imagePath = path.join(imagesDir, imageName)

      // Check if the file exists
      fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
          // File does not exist
          res.status(404).json({ isReady: false })
        } else {
          // File exists
          res.status(200).json({ isReady: true, url: `/images/${imageName}` })
        }
      })
    } catch (error) {
      console.error('Error checking image:', error)
      res.status(500).json({ message: 'Error checking image', error: error.message })
    }
  }
}
