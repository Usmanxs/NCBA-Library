import AWS from "aws-sdk";
import { Buffer } from "buffer";

// Initialize an S3 client with your AWS credentials
const s3 = new AWS.S3({
  accessKeyId: "use your own",
  secretAccessKey: "use your own",
});

export async function uploadBase64ImageToDO(
  objectKey: string,
  base64Data: string,
  contentType: string
): Promise<string> {
  // Remove the header from the base64 string
  const data = base64Data.replace(/^data:image\/\w+;base64,/, "");

  // Decode the base64 data into a buffer
  const decodedData = Buffer.from(data, "base64");

  // Set the content type of the object
  const params = {
    Bucket: "use you own",
    Key: objectKey,
    ContentType: contentType,
    Body: decodedData,
    ACL: "public-read",
  };

  try {
    // Upload the object to AWS S3
    const response = await s3.upload(params).promise();
    console.log(`File uploaded successfully to ${response.Location}`);
    return response.Location;
  } catch (error) {
    console.error("Error uploading file:", error);
    return base64Data;
  }
}

export function isStringALink(str: string) {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
