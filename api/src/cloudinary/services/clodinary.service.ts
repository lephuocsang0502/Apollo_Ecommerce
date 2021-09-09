import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { Readable } from 'stream';
import { Image } from 'src/common/Image.interface';
@Injectable()

export class CloudinaryService {
    async uploadImage(
      file:Image,
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
      return new Promise((resolve, reject) => {
        const upload = v2.uploader.upload_stream((error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
        Readable.from(file.buffer).pipe(upload); // covert buffer to readable stream and pass to upload
      });
    }


    async uploadImageToCloudinary(file: Image) {
        return await this.uploadImage(file).catch((err) => {
            throw new BadRequestException(err);
        });
    }
  }