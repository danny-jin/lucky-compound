import { Injectable } from '@nestjs/common';
import { ConfigService } from './config.service';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {
  }

  getHello(): string {
    return 'Hello World!';
  }
}
