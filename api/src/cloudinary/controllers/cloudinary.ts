
import { ConfigOptions, v2 } from 'cloudinary';
import { CLOUDINARY } from 'src/constant.enum';


export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (): ConfigOptions => {
    return v2.config({
        cloud_name: 'dufjdu603', 
        api_key: '948614174949823', 
        api_secret: 'AqQ6HUVLXae0Ep9UdfgV4TsGBdw' 
    });
  },
};