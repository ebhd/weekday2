import "server-only";
import sharp from "sharp";

type CompressOpts = {
  maxWidth: number;
  maxHeight: number;
  quality?: number;
  format?: "webp" | "jpeg" | "png" | "avif";
};

export async function compressImageFile(
  file: File,
  opts: CompressOpts
): Promise<{
  buffer: Buffer;
  contentType: string;
  ext: string;
  originalBytes: number;
  compressedBytes: number;
}> {
  const { maxWidth, maxHeight, quality = 70, format = "webp" } = opts;

  const arrayBuffer = await file.arrayBuffer();
  const input = Buffer.from(arrayBuffer);

  const image = sharp(input, { failOnError: false }).rotate();

  const resized = image.resize({
    width: maxWidth,
    height: maxHeight,
    fit: "inside",
    withoutEnlargement: true,
  });

  let output: sharp.Sharp;
  let contentType: string;
  let ext: string;

  switch (format) {
    case "avif":
      output = resized.avif({ quality });
      contentType = "image/avif";
      ext = "avif";
      break;
    case "jpeg":
      output = resized.jpeg({ quality, mozjpeg: true });
      contentType = "image/jpeg";
      ext = "jpg";
      break;
    case "png":
      output = resized.png({ compressionLevel: 9 });
      contentType = "image/png";
      ext = "png";
      break;
    default:
      output = resized.webp({ quality });
      contentType = "image/webp";
      ext = "webp";
  }

  const buffer = await output.toBuffer();

  return {
    buffer,
    contentType,
    ext,
    originalBytes: input.byteLength,
    compressedBytes: buffer.byteLength,
  };
}
