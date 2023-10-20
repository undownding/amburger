import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { beforeAll, describe, test } from 'vitest'
import request from 'supertest'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  test('/version (GET)', async () => {
    return request(app.getHttpServer())
      .get('/version')
      .expect(200)
      .expect({ version: '0.0.1' })
  })
})
