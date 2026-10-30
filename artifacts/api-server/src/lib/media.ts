import sharp from "sharp";

const GOOGLE_IMAGE_HOSTS = ["googleusercontent.com", "ggpht.com"];

export const IMAGE_UPLOAD_POLICY = Object.freeze({
  maxInputBytes: 5 * 1024 * 1024,
  maxOutputBytes: 450 * 1024,
  maxDimension: 1600,
  quality: 78,
});

function parsePostgresTextArray(value: string): string[] {
  const inner = value.slice(1, -1).trim();
  if (!inner) return [];

  const result: string[] = [];
  let current = "";
  let quoted = false;
  let escaped = false;

  const push = () => {
    const item = current.trim();
    if (item && item !== "NULL") result.push(item);
    current = "";
  };

  for (const character of inner) {
    if (escaped) {
      current += character;
      escaped = false;
    } else if (character === "\\" && quoted) {
      escaped = true;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      push();
    } else {
      current += character;
    }
  }
  push();
  return result;
}

/**
 * Read image lists returned by PostgreSQL JSONB/TEXT[] columns as well as
 * older rows that stored the list as JSON text. Keeping this at the API
 * boundary prevents an admin edit from turning a legacy gallery into [].
 */
export function parsePhotoList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((photo): photo is string => typeof photo === "string" && photo.trim().length > 0);
  }
  if (typeof value !== "string") return [];

  const input = value.trim();
  if (!input) return [];

  try {
    const parsed = JSON.parse(input);
    if (Array.isArray(parsed)) {
      return parsed.filter((photo): photo is string => typeof photo === "string" && photo.trim().length > 0);
    }
    if (typeof parsed === "string" && parsed.trim()) return [parsed.trim()];
  } catch {
    // Continue with PostgreSQL-array and legacy single-value parsing below.
  }

  if (input.startsWith("{") && input.endsWith("}")) {
    return parsePostgresTextArray(input);
  }
  return [input];
}

type ImageProcessingOptions = Partial<{
  maxOutputBytes: number;
  maxDimension: number;
  quality: number;
}>;

/**
 * Normalize every uploaded photo to an upright, bounded WebP.
 * The quality loop protects pages from unusually noisy photos that remain
 * large even after the first WebP encode.
 */
export async function processImageToWebp(
  buffer: Buffer,
  options: ImageProcessingOptions = {},
): Promise<Buffer> {
  if (!buffer || buffer.length === 0) throw new Error("File gambar kosong atau tidak valid");

  const maxOutputBytes = options.maxOutputBytes ?? IMAGE_UPLOAD_POLICY.maxOutputBytes;
  const initialDimension = options.maxDimension ?? IMAGE_UPLOAD_POLICY.maxDimension;
  const initialQuality = options.quality ?? IMAGE_UPLOAD_POLICY.quality;
  let dimension = initialDimension;
  let quality = initialQuality;
  let bestBuffer = Buffer.alloc(0) as Buffer<ArrayBufferLike>;

  for (let attempt = 0; attempt < 14; attempt++) {
    const output = await sharp(buffer)
      .rotate()
      .resize({
        width: dimension,
        height: dimension,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: Math.max(40, Math.min(90, quality)), effort: 4 })
      .toBuffer();

    bestBuffer = output;
    if (output.length <= maxOutputBytes) return output;

    if (quality > 48) {
      quality -= 8;
    } else {
      dimension = Math.max(320, Math.floor(dimension * 0.8));
      quality = initialQuality;
    }
  }

  return bestBuffer;
}

function isGoogleImageHost(hostname: string): boolean {
  return GOOGLE_IMAGE_HOSTS.some(domain => hostname === domain || hostname.endsWith(`.${domain}`));
}

/**
 * Request a sufficiently large rendition from image CDNs used by Google Maps.
 * The source photo is not changed; only the delivery size is upgraded.
 */
export function optimizeImageUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const input = value.trim();

  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return input;
  }

  const hostname = url.hostname.toLowerCase();

  if (isGoogleImageHost(hostname)) {
    // Google-hosted photo URLs commonly end in =w408-h544-k-no or =s400.
    // Replace only the delivery-size suffix, preserving the source photo id.
    url.pathname = url.pathname.replace(
      /=(?:w|h|s)\d+(?:-[a-z0-9]+)*$/i,
      "=w1200-h900-k-no",
    );
  }

  if (hostname === "maps.googleapis.com" && url.pathname.includes("/maps/api/place/photo")) {
    url.searchParams.set("maxwidth", "1200");
    url.searchParams.delete("maxheight");
  }

  return url.toString();
}