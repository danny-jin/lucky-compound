import { Controller, Get, Param } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ConfigService } from './config.service';
import { Config } from './types';
import { LuckyService } from './lucky.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private luckyService: LuckyService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }

  @Get('state')
  getState(): Config {
    return this.configService.getState();
  }

  @ApiParam({ name: 'isRunning', type: Boolean })
  @Get('set-is-running/:isRunning')
  setIsRunning(@Param('isRunning') isRunning: boolean): Config {
    this.configService.setIsRunning(isRunning);
    return this.configService.getState();
  }

  @Get('manual-cron')
  async manualCron() {
    await this.luckyService.handleCron();
  }
}
