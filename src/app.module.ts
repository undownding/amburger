import { Module } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { UserModule } from './user/user.module.js'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmModuleOptions } from '@/lib/data-source.js'
import { ConfigModule } from '@nestjs/config'
import { AdminModule } from './admin/admin.module.js'
import { OssModule } from '@/oss/oss.module.js'
import { SmsModule } from './sms/sms.module.js'
import { CacheModule } from '@nestjs/cache-manager'
import { AssignerModule } from '@/resource/assigner/assigner.module.js'
import { ResourceModule } from '@/resource/resource.module.js'

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmModuleOptions),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    UserModule,
    AdminModule,
    OssModule,
    SmsModule,
    ResourceModule,
    AssignerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
