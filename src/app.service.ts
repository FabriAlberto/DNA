import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Made with ❤️ by Fabricio Alberto';
  }
}
