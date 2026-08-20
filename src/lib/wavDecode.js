// BOX 2 — bytes → raw samples. The React Native replacement for the web app's
// audioSamples.js.
//
// WHY THIS FILE EXISTS AT ALL:
// The web version calls `AudioContext.decodeAudioData(buf)` and gets a
// Float32Array back. `AudioContext` is a BROWSER GLOBAL — it does not exist in
// React Native. There is no drop-in. So we do the decode ourselves.
//
// That is only tractable because we ask the recorder for UNCOMPRESSED audio.
// Uncompressed PCM is just a list of numbers with a small header describing how
// to read them — a few dozen lines. A compressed format (AAC, MP3, Opus) would
// need a full codec, which is not something to hand-write.
//
// ⚠️ PLATFORM REALITY (see src/lib/recordingOptions.js for the receipts):
//   iOS     → LINEARPCM 16-bit WAV  → this file works.
//   Android → AAC in an .m4a        → this file CANNOT read it. MediaRecorder
//             has no PCM output at all; it is a dependency limit, not a config
//             mistake. decodeWav() returns a clear error rather than garbage.
//   Web     → webm/opus             → use the web app's audioSamples.js path.
//
// The error path matters as much as the happy path: a wrong answer from a
// mis-parsed header looks like a pitch bug and costs hours.

// ── RIFF/WAVE layout ────────────────────────────────────────────────────────
//
//   offset  bytes  contents
//   0       4      "RIFF"
//   4       4      file size - 8
//   8       4      "WAVE"
//   then a series of CHUNKS, each: 4-byte id, 4-byte size, then `size` bytes.
//     "fmt "  → how to interpret the samples
//     "data"  → the samples themselves
//
// Chunks are NOT at fixed offsets. Recorders inject extra chunks (LIST, fact),
// so we WALK the chunk list instead of assuming data starts at byte 44 — the
// single most common WAV-parsing bug.

const FORMAT_PCM = 1
const FORMAT_FLOAT = 3

function readTag(bytes, offset) {
  return String.fromCharCode(bytes[offset], bytes[offset + 1], bytes[offset + 2], bytes[offset + 3])
}

/**
 * Parse a WAV file's bytes into mono Float32 samples in [-1, 1].
 *
 * @param {Uint8Array} bytes  the whole file
 * @returns {{ samples: Float32Array, rate: number }}
 * @throws  {Error} with an actionable message when the bytes are not PCM WAV
 */
export function decodeWav(bytes) {
  if (!bytes || bytes.length < 44) {
    throw new Error(`WAV too short (${bytes?.length ?? 0} bytes) — recording probably failed`)
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)

  if (readTag(bytes, 0) !== 'RIFF' || readTag(bytes, 8) !== 'WAVE') {
    // The common case: Android handed us an m4a/AAC file.
    const tag = readTag(bytes, 4) // 'ftyp' for MP4/M4A containers
    const hint =
      tag === 'ftyp'
        ? ' — this is an MP4/M4A (AAC) file. Android cannot record PCM via expo-audio; see recordingOptions.js.'
        : ''
    throw new Error(`Not a RIFF/WAVE file${hint}`)
  }

  let fmt = null
  let dataOffset = -1
  let dataLength = 0

  // Walk the chunks. Sizes are little-endian; odd-sized chunks are padded to
  // even, which is why the cursor advances by size + (size & 1).
  let cursor = 12
  while (cursor + 8 <= bytes.length) {
    const id = readTag(bytes, cursor)
    const size = view.getUint32(cursor + 4, true)
    const body = cursor + 8

    if (id === 'fmt ') {
      fmt = {
        format: view.getUint16(body, true),
        channels: view.getUint16(body + 2, true),
        rate: view.getUint32(body + 4, true),
        bitsPerSample: view.getUint16(body + 14, true),
      }
    } else if (id === 'data') {
      dataOffset = body
      // Some encoders write 0 or 0xFFFFFFFF for a stream they did not finalize;
      // fall back to "everything left in the file".
      dataLength = size > 0 && body + size <= bytes.length ? size : bytes.length - body
    }

    cursor = body + size + (size & 1)
  }

  if (!fmt) throw new Error('WAV has no "fmt " chunk')
  if (dataOffset < 0) throw new Error('WAV has no "data" chunk')

  const { format, channels, rate, bitsPerSample } = fmt

  if (format !== FORMAT_PCM && format !== FORMAT_FLOAT) {
    throw new Error(
      `WAV is compressed (format code ${format}); only uncompressed PCM (1) and float (3) can be read here`
    )
  }

  // ── Sample extraction ─────────────────────────────────────────────────────
  // Two jobs at once: convert to Float32 in [-1,1], and mix down to mono.
  //
  // Interleaving: a stereo file stores L,R,L,R,… so channel 0 is every
  // `channels`-th sample. We average the channels rather than dropping one —
  // one mic recording one voice should be mono anyway (see recordingOptions),
  // but averaging is harmless and correct if it is not.
  const bytesPerSample = bitsPerSample / 8
  const frameCount = Math.floor(dataLength / (bytesPerSample * channels))
  const out = new Float32Array(frameCount)

  for (let f = 0; f < frameCount; f++) {
    let sum = 0
    for (let c = 0; c < channels; c++) {
      const at = dataOffset + (f * channels + c) * bytesPerSample
      let v
      if (format === FORMAT_FLOAT && bitsPerSample === 32) {
        v = view.getFloat32(at, true)
      } else if (bitsPerSample === 16) {
        // 16-bit signed: divide by 32768 so the range lands in [-1, 1).
        v = view.getInt16(at, true) / 32768
      } else if (bitsPerSample === 8) {
        // 8-bit WAV is UNSIGNED with 128 as silence — the one asymmetry in the
        // format, and an easy way to get a permanent DC offset if missed.
        v = (view.getUint8(at) - 128) / 128
      } else if (bitsPerSample === 24) {
        const b0 = view.getUint8(at)
        const b1 = view.getUint8(at + 1)
        const b2 = view.getUint8(at + 2)
        // Assemble little-endian, then sign-extend from 24 bits to 32.
        let n = (b2 << 16) | (b1 << 8) | b0
        if (n & 0x800000) n |= ~0xffffff
        v = n / 8388608
      } else {
        throw new Error(`Unsupported bit depth: ${bitsPerSample}`)
      }
      sum += v
    }
    out[f] = sum / channels
  }

  return { samples: out, rate }
}

// ── Downsampling ────────────────────────────────────────────────────────────
//
// We record at 44100 Hz because consonants need the bandwidth to sound right.
// Pitch analysis does not: voices live at 75–350 Hz, so 16 kHz is already ~23x
// the highest F0 we look for. Running YIN at 44.1 kHz is ~2.75x the work per
// frame for zero accuracy gain.
//
// This is a plain averaging decimator, not a proper anti-aliased resampler.
// That is a deliberate trade: averaging each output sample over the input
// window it spans acts as a crude low-pass, which is enough when the thing we
// measure (periodicity in the 75–350 Hz band) is far below the new Nyquist
// limit of 8 kHz. Aliased high-frequency hiss cannot masquerade as a 200 Hz
// period.

export const ANALYSIS_RATE = 16000

export function downsample(samples, fromRate, toRate = ANALYSIS_RATE) {
  if (fromRate <= toRate) return { samples, rate: fromRate }

  const ratio = fromRate / toRate
  const outLength = Math.floor(samples.length / ratio)
  const out = new Float32Array(outLength)

  for (let i = 0; i < outLength; i++) {
    const start = Math.floor(i * ratio)
    const end = Math.min(samples.length, Math.floor((i + 1) * ratio))
    let sum = 0
    for (let j = start; j < end; j++) sum += samples[j]
    out[i] = end > start ? sum / (end - start) : 0
  }

  return { samples: out, rate: toRate }
}

/** decodeWav + downsample in one call — what the scorer actually wants. */
export function decodeWavForAnalysis(bytes, targetRate = ANALYSIS_RATE) {
  const { samples, rate } = decodeWav(bytes)
  return downsample(samples, rate, targetRate)
}
