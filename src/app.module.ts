import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmModuleOptions } from '@/lib/data-source'
import { ConfigModule } from '@nestjs/config'
import { AdminModule } from './admin/admin.module'
import { OssModule } from '@/oss/oss.module'
import { SmsModule } from './sms/sms.module'
import { CacheModule } from '@nestjs/cache-manager'
import { AssignerModule } from '@/resource/assigner/assigner.module'
import { ResourceModule } from '@/resource/resource.module'

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
