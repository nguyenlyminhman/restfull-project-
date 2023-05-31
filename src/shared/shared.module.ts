import { Module } from '@nestjs/common';
import { AppConfigService } from './app-config.service';

const providers = [AppConfigService];

@Module({
  imports: [],
  controllers: [],
  providers,
  exports: [...providers],
})
export class SharedModule {}
