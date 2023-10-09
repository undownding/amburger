import { repl } from '@nestjs/core'
// Require the following line for paths mapping in tsconfig.json to work
import 'tsconfig-paths/register'
import { AppModule } from '@/app.module.js'

async function bootstrap() {
  await repl(AppModule)
}
bootstrap()
