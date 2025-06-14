import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { S3UploadError } from "../utils/errors";

const s3 = new S3Client({ region: "us-west-1" });

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
    return `https://${process.env.AWS_S3_BUCKET}.s3.us-west-1.amazonaws.com/${key}`;
  } catch (error) {
    throw S3UploadError;
  }
};
export default uploadImageToS3;
