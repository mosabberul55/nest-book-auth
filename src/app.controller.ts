import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthorizationGuard } from './guards/authorization.guard';
import { Action } from './role/enums/action.enum';
import { Resource } from './role/enums/resource.enum';
import { Permissions } from './decorators/permissions.decorator';

@UseGuards(AuthGuard, AuthorizationGuard)
@Controller('/products')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Permissions([{ resource: Resource.settings, actions: [Action.read] }])
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
