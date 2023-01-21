import { Module } from '@nestjs/common';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { PrismaDocumentRepository } from '@infra/database/prisma/repositories/prisma-document.repository';

@Module({
  providers: [PrismaService, PrismaDocumentRepository],
  exports: [PrismaDocumentRepository, PrismaService],
})
export class PrismaModule {}
