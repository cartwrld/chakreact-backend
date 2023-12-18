import * as express from 'express'
import { AppDataSource } from './data-source'
import createError from 'http-errors'
import * as cors from 'cors'
import { RouteDefinition } from './decorator/RouteDefinition'
import { GenerateController } from './controller/GenerateController'
import { Express } from 'express'
import * as path from 'path'

const port = 3004

AppDataSource.initialize().then(async () => {
  // create express app
  const app: Express = express()

  // app.use('/images', express.static('D:/ComfyUI/ComfyUI/output'))
  app.use('/images', express.static(path.join(__dirname, 'images')))
  // app.use('/images', express.static(join(__dirname, '..', 'images')))

  app.use(express.json())

  const corsOptions = {
    origin: 'http://localhost:3000', // allow to server to accept request from different origin
    credentials: true, // This allows session cookie from browser to pass through
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
  }

  // If you want to set specific options for CORS:
  app.use(cors(corsOptions))

  // Iterate over all our controllers and register our routes
  const controllers: any[] = [GenerateController]
  controllers.forEach((controller) => {
    // This is our instantiated class
    // eslint-disable-next-line new-cap
    const instance = new controller()
    // The prefix saved to our controller
    const path = Reflect.getMetadata('path', controller)
    // Our `routes` array containing all our routes for this controller
    const routes: RouteDefinition[] = Reflect.getMetadata('routes', controller)

    // Iterate over all routes and register them to our express application
    routes.forEach((route) => {
      // eslint-disable-next-line max-len
      app[route.method.toLowerCase()](path + route.param, (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const result = instance[route.action](req, res, next)
        if (result instanceof Promise) {
          result.then((result) => result !== null && result !== undefined ? res.send(result) : next())
            .catch((err) => next(createError(500, err)))
        } else if (result !== null && result !== undefined) res.json(result)
      })
    })
  })

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404))
  })

  // error handler
  app.use(function (err, req, res, next) {
    // res.status(err.status || 500)
    // res.json({
    //   status: err.status,
    //   message: err.message,
    //   stack: err.stack.split(/\s{4,}/)
    // })
  })

  // start express server
  app.listen(port)

  console.log('Open http://localhost:' + port + '/workflow to see results')
}).catch(error => console.log(error))
