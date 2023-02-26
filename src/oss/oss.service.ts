import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as OSS from 'ali-oss'
import { add } from 'date-fns'

@Injectable()
export class OssService {
  private readonly client: OSS
  private readonly bucket: string
  private readonly region: string

  constructor(configService: ConfigService) {
    this.region = `oss-cn-${configService.get('OSS_REGION')}`
    this.bucket = configService.get('OSS_PUBLIC_BUCKET')
    this.client = new OSS({
      region: this.region,
      accessKeyId: configService.get('OSS_ACCESS_KEY_ID'),
      accessKeySecret: configService.get('OSS_ACCESS_KEY_SECRET'),
      bucket: this.bucket,
    })
  }

  public async upload(key: string, file: Buffer): Promise<void> {
    await this.client.put(key, file)
  }

  public getSign(key: string): object {
    const policy = {
      expiration: add(new Date(), { minutes: 10 }).toISOString(),
      conditions: [{ key }, { bucket: this.bucket }],
    }
    return this.client['calculatePostSignature'](policy)
  }

  public getHost(): string {
    return `https://${this.bucket}.${this.region}.aliyuncs.com`
  }
}
