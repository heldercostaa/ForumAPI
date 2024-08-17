import { randomUUID } from 'node:crypto';

import {
  IUploader,
  UploadParams,
} from '@/domain/forum/application/storage/uploader';

type Upload = {
  fileName: string;
  url: string;
};

export class FakeUploader implements IUploader {
  public uploads: Upload[] = [];

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = randomUUID();

    this.uploads.push({ fileName, url });

    return { url };
  }
}
