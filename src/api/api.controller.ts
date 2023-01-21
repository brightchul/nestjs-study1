import { Controller, Get, HostParam } from '@nestjs/common';

// /etc/hosts에 v1.api.localhost 가 등록되어 있어야 제대로 동작한다.
@Controller({ host: ':version.api.localhost' })
export class ApiController {
  @Get()
  index(@HostParam('version') version: string): string {
    return `Hello, API ${version}`;
  }
}
