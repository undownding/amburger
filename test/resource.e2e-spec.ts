import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { faker } from '@faker-js/faker'
import { Resource } from '@/resource/resource.entity'
import { ResourceService } from '@/resource/resource.service'
import { TransactionalTestContext } from 'typeorm-transactional-tests'
import { getDataSourceToken } from '@nestjs/typeorm'
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from 'vitest'
import request from 'supertest'

describe('Resource (e2e)', () => {
  let app: INestApplication
  let accessToken: string
  let resource: Resource
  let resourceService: ResourceService
  let transactionalContext: TransactionalTestContext

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    const dataSource = app.get(getDataSourceToken())
    transactionalContext = new TransactionalTestContext(dataSource)

    const { body } = await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phone: faker.string
          .numeric({ length: 11, allowLeadingZeros: false })
          .toString(),
      })
    accessToken = body.accessToken

    resourceService = app.get(ResourceService)
    resource = await resourceService.create(
      {
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        data: {
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraph(),
          other: faker.lorem.paragraph(),
        },
      },
      body.id,
    )
  })

  beforeEach(() => transactionalContext.start())

  afterEach(() => transactionalContext.finish())

  test('should create resource', async () => {
    const title = faker.lorem.sentence()
    const content = faker.lorem.paragraph()
    const data = { title, content }
    return request(app.getHttpServer())
      .post('/resource')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title,
        content,
        data,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            title,
            content,
            data,
          }),
        )
        expect(body).toHaveProperty('id')
        expect(body.id).toBeTruthy()
        expect(body).toHaveProperty('isPublic')
      })
  })

  test("should get user's resource", async () => {
    return request(app.getHttpServer())
      .get('/resource')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.count).toBe(1)
        expect(body.data[0]).toEqual(
          expect.objectContaining({
            title: resource.title,
            content: resource.content,
            data: resource.data,
          }),
        )
      })
  })

  test('should get a resource', async () => {
    return request(app.getHttpServer())
      .get(`/resource/${resource.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            title: resource.title,
            content: resource.content,
            data: resource.data,
          }),
        )
        expect(body).toHaveProperty('id')
        expect(body.id).toBeTruthy()
        expect(body).toHaveProperty('isPublic')
      })
  })

  test('should update a resource', async () => {
    const title = faker.lorem.sentence()
    const content = faker.lorem.paragraph()
    const data = { title, content }
    return request(app.getHttpServer())
      .patch(`/resource/${resource.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title,
        content,
        data,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            title,
            content,
            data,
          }),
        )
        expect(body).toHaveProperty('id')
        expect(body.id).toBeTruthy()
        expect(body).toHaveProperty('isPublic')
      })
  })

  test('should delete a resource', async () => {
    await request(app.getHttpServer())
      .delete(`/resource/${resource.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)

    await resourceService
      .count({ where: { id: resource.id } })
      .then((count) => {
        expect(count).toBe(0)
      })
  })
})
