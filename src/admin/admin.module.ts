import { Module } from '@nestjs/common'
import { AdminService } from './admin.service.js'
import { AdminController } from './admin.controller.js'
import { UserModule } from '@/user/user.module.js'

@Module({
  imports: [UserModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
