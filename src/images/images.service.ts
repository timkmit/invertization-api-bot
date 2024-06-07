import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class ImagesService {
  constructor() {}

  loadManyImages(files: Array<Express.Multer.File>) {
    const fileNames = new Array(files.length)
      .fill(0)
      .map((_, i) => `${randomUUID()}.${files[i].mimetype.split('/')[1]}`);
    
    for (let i = 0; i < fileNames.length; i++) {
      const fileName = fileNames[i];
      const file = files[i];
      try {
        fs.writeFileSync(
          join(__dirname, '../../public', fileName),
          file.buffer,
        );
      } catch (e) {
      }
    }

    return fileNames;
  }

  deleteManyImages(fileNames: string[]) {
    for (let i = 0; i < fileNames.length; i++) {
      try {
        fs.unlinkSync(join(__dirname, '../../public', fileNames[i]));
      } catch (e) {
      }
    }
  }
}
