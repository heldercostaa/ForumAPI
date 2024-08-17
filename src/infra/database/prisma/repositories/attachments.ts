import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

import { IAttachmentsRepository } from '@/domain/forum/application/repositories/attachments';
import { Attachment } from '@/domain/forum/enterprise/entities/attachment';
import { PrismaAttachmentMapper } from '../mappers/prisma-attachment';

@Injectable()
export class PrismaAttachmentsRepository implements IAttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPrisma(attachment);

    await this.prisma.attachment.create({ data });
  }
}
