import { NestFactory } from '@nestjs/core'
import 'tsconfig-paths/register'
import { AppModule } from '@/app.module'
import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import fs, { writeFileSync } from 'fs'
import path from 'path'

async function bootstarp() {
  const app = await NestFactory.create(AppModule)
  await setupSwagger(app)
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
  const dist = path.resolve(process.cwd(), 'dist')
  if (!fs.existsSync(dist)) {
    fs.mkdirSync(dist)
  }
  writeFileSync(outputPath, JSON.stringify(document), { encoding: 'utf8' })

  SwaggerModule.setup('/apidoc', app, document)
}

bootstarp()
