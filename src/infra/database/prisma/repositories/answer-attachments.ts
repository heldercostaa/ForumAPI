import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

import { IAnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment';

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements IAnswerAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const answerAttachments = await this.prisma.attachment.findMany({
      where: { answerId },
    });

    return answerAttachments.map(PrismaAnswerAttachmentMapper.toDomain);
  }

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return;
    }

    const data = PrismaAnswerAttachmentMapper.toPrismaUpdateMany(attachments);

    await this.prisma.attachment.updateMany(data);
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return;
    }

    const attachmentIds = attachments.map((attachment) =>
      attachment.id.toString(),
    );

    await this.prisma.attachment.deleteMany({
      where: { id: { in: attachmentIds } },
    });
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: { answerId },
    });
  }
}
