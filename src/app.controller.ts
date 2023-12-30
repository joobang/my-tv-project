import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Controller()
export class AppController{
    constructor(
        private readonly configService: ConfigService,
    ){}

    @Get()
    getHello(): string{
        return 'hello';
    }

    @Get('/db-host-from-config')
    getDatabaseHostFromConfigService(): string{
        return this.configService.get('DATABASE_HOST');
    }
}