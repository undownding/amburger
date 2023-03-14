import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getVersion(): object {
    return { version: '0.0.1' }
  }
}
