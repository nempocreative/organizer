import { Router } from "express";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { logger } from "../lib/logger";

const router = Router();
const CREW_KEY = "nempo-crew-2024";
const VOICE    = "id-ID-ArdiNeural";

function buildSsml(text: string): string {
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="id-ID">
  <voice name="${VOICE}">
    <mstts:express-as style="sports-commentary">
      <prosody rate="-8%" pitch="-12%" volume="+18%">
        ${text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}
      </prosody>
    </mstts:express-as>
  </voice>
</speak>`;
}

router.post("/tts/announce", async (req, res) => {
  const key = req.headers["x-crew-key"];
  if (key !== CREW_KEY) return res.status(401).json({ error: "Unauthorized" });

  const { text } = req.body as { text?: string };
  if (!text?.trim()) return res.status(400).json({ error: "text required" });

  try {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3, undefined);

    const ssml = buildSsml(text);
    const chunks: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      const { audioStream } = tts.toStream(ssml);
      audioStream.on("data",  (d: Buffer) => chunks.push(d));
      audioStream.on("close", resolve);
      audioStream.on("error", reject);
    });

    const audio = Buffer.concat(chunks);
    logger.info({ voice: VOICE, style: "sports-commentary", bytes: audio.length }, "TTS generated");

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", audio.length);
    res.setHeader("Cache-Control", "no-cache");
    res.end(audio);
  } catch (err: any) {
    logger.warn({ err }, "SSML sports-commentary failed, retrying plain prosody");

    try {
      const tts2 = new MsEdgeTTS();
      await tts2.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3, undefined);

      const plainSsml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="id-ID">
  <voice name="${VOICE}">
    <prosody rate="-8%" pitch="-14%" volume="+18%">
      ${text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}
    </prosody>
  </voice>
</speak>`;

      const chunks2: Buffer[] = [];
      await new Promise<void>((resolve, reject) => {
        const { audioStream } = tts2.toStream(plainSsml);
        audioStream.on("data",  (d: Buffer) => chunks2.push(d));
        audioStream.on("close", resolve);
        audioStream.on("error", reject);
      });

      const audio2 = Buffer.concat(chunks2);
      logger.info({ voice: VOICE, style: "plain-prosody", bytes: audio2.length }, "TTS generated (fallback)");

      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Content-Length", audio2.length);
      res.setHeader("Cache-Control", "no-cache");
      res.end(audio2);
    } catch (err2) {
      logger.error({ err2 }, "TTS failed");
      res.status(500).json({ error: "TTS generation failed" });
    }
  }
});

export default router;
