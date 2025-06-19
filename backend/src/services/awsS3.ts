import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { S3UploadError } from "../utils/errors";

const s3 = new S3Client({
  region: process.env.AWS_DEFAULT_REGION || process.env.AWS_REGION || "us-west-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const uploadImageToS3 = async (file: Express.Multer.File, folder: string = "playlist-covers") => {
  try {
    const fileExtension = file.originalname.split(".").pop();
    const key = `${folder}/${uuidv4()}.${fileExtension}`;
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    const command = new PutObjectCommand(params);
    const response = await s3.send(command);
    if (!response.ETag) {
      throw S3UploadError;
    }
    const region = process.env.AWS_REGION || "us-west-1";
    return `https://${process.env.AWS_S3_BUCKET}.s3.${region}.amazonaws.com/${key}`;
  } catch (error) {
    throw S3UploadError;
  }
};
export default uploadImageToS3;
