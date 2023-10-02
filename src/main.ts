import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { writeFileSync } from 'fs'
import cookieParser from 'cookie-parser'
import path from 'path'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  })

  app.setGlobalPrefix('api')

  if (configService.get('NODE_ENV') !== 'production') {
    setupSwagger(app)
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    }),
  )

  app.use(cookieParser())

  await app.listen(3000)
}

export function setupSwagger(app: INestApplication): void {
  const builder = new DocumentBuilder()
    .setTitle('Amburger')
    .setDescription('后端业务 API')
    .setVersion('0.0.1')
    .addCookieAuth('jwt')
    .build()
  const document = SwaggerModule.createDocument(app, builder)
  const outputPath = path.resolve(process.cwd(), 'dist', 'swagger.json')
  writeFileSync(outputPath, JSON.stringify(document), { encoding: 'utf8' })

  SwaggerModule.setup('/apidoc', app, document)
}
bootstrap()
