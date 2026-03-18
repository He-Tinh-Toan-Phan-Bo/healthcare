import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(configService: ConfigService) {
    // Prisma v7 requires either an adapter (direct DB) or an accelerateUrl.
    // We use @prisma/adapter-pg for a direct PostgreSQL connection.
    const connectionString = configService.getOrThrow<string>('DATABASE_URL');
    super({
      adapter: new PrismaPg({ connectionString }),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    // Prisma v7 no longer exposes "beforeExit" on $on typings.
    // Nest already handles SIGTERM/SIGINT; this is an extra safety net.
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}

