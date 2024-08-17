import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@/core/either';

import { Attachment } from '../../enterprise/entities/attachment';
import { IAttachmentsRepository } from '../repositories/attachments';
import { IUploader } from '../storage/uploader';
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type';

type UploadAndCreateAttachmentUseCaseParams = {
  fileName: string;
  fileType: string;
  body: Buffer;
};

type UploadAndCreateAttachmentUseCaseReturn = Either<
  InvalidAttachmentTypeError,
  {
    attachment: Attachment;
  }
>;

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentRepository: IAttachmentsRepository,
    private uploader: IUploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentUseCaseParams): Promise<UploadAndCreateAttachmentUseCaseReturn> {
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType));
    }

    const { url } = await this.uploader.upload({ fileName, fileType, body });

    const attachment = Attachment.create({
      title: fileName,
      url,
    });

    await this.attachmentRepository.create(attachment);

    return right({ attachment });
  }
}
