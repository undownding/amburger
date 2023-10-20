import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import supertest from 'supertest'
import { AppModule } from '@/app.module.js'
import { faker } from '@faker-js/faker'
import { SmsProxyService } from '@/sms/sms-proxy.service.js'
import { beforeAll, describe, expect, test } from 'vitest'

const request = supertest

describe('Auth (e2e)', () => {
  let app: INestApplication
  let smsService: SmsProxyService
  const username = faker.internet.userName()
  const email = faker.internet.email()
  const phone = faker.random
    .numeric(11, { allowLeadingZeros: false })
    .toString()
  const password = faker.internet.password()

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    smsService = moduleFixture.get(SmsProxyService)
    await app.init()
  })

  test('should created a user after sign up', () =>
    request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({
        username,
        email,
        password,
        phone,
      })
      .expect(201)
      .expect(({ body }) =>
        expect(body).toEqual(
          expect.objectContaining({ name: username, email, phone }),
        ),
      ))

  test('should sign-in with username', () =>
    request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        username,
        password,
      })
      .expect(201)
      .expect(({ body }) =>
        expect(body).toEqual(
          expect.objectContaining({ name: username, email, phone }),
        ),
      ))

  test('should sign-in with email', () =>
    request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        email,
        password,
      })
      .expect(201)
      .expect(({ body }) =>
        expect(body).toEqual(
          expect.objectContaining({ name: username, email, phone }),
        ),
      ))

  test('should sign-in with phone & code', async () => {
    const code = faker.string.numeric({ length: 6, allowLeadingZeros: false })
    await smsService.sendCode({ regionCode: '+86', phone }, code)
    await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        phone,
        code,
      })
      .expect(201)
      .expect(({ body }) =>
        expect(body).toEqual(
          expect.objectContaining({ name: username, email, phone }),
        ),
      )
  })

  test('should created a new user when use an unregister phone', async () => {
    const code = faker.string.numeric({ length: 6, allowLeadingZeros: false })
    const phone = faker.string
      .numeric({ length: 6, allowLeadingZeros: false })
      .toString()
    await smsService.sendCode({ regionCode: '+86', phone }, code)
    await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        phone,
        code,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body).toEqual(expect.objectContaining({ phone }))
        expect(body.name).toMatch(/^手机用户/)
      })
  })

  test('should refresh token', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        username,
        password,
      })
      .expect(201)
    const { refreshToken } = body
    await request(app.getHttpServer())
      .post('/auth/token')
      .set('Authorization', `Bearer ${refreshToken}`)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toHaveProperty('accessToken')
        expect(body.accessToken).toBeTruthy()
        expect(body.accessToken.length).not.toBe(0)
      })
  })

  test('should update password', async () => {
    const newPassword = faker.internet.password()
    const { body } = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        username,
        password,
      })
      .expect(201)
    await request(app.getHttpServer())
      .post('/user/me/password')
      .set('Authorization', `Bearer ${body.accessToken}`)
      .send({
        password: newPassword,
      })
      .expect(201)
    await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        username,
        password: newPassword,
      })
      .expect(201)
      .expect(({ body }) =>
        expect(body).toEqual(
          expect.objectContaining({ name: username, email, phone }),
        ),
      )
  })

  test('should reset password', async () => {
    const code = faker.string.numeric({ length: 6, allowLeadingZeros: false })
    await smsService.sendCode({ regionCode: '+86', phone }, code)
    const newPassword = faker.internet.password()
    await request(app.getHttpServer())
      .post('/user/reset-password')
      .send({
        phone,
        code,
        password: newPassword,
      })
      .expect(201)
    await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        username,
        password: newPassword,
      })
      .expect(201)
      .expect(({ body }) =>
        expect(body).toEqual(
          expect.objectContaining({ name: username, email, phone }),
        ),
      )
  })
})
