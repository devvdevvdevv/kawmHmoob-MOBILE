// ─────────────────────────────────────────────────────────────────────────────
// 🗑️ THROWAWAY SPIKE — DELETE THIS FILE once it passes on iOS AND Android.
//
// Route: /spike  (Expo Router is file-based — this file IS the route.)
//
// THE ONE QUESTION IT ANSWERS: can this phone hand me an actual uncompressed WAV?
// Everything downstream (pitch detection → tone scoring) needs RAW SAMPLES — a
// plain list of numbers. Compressed audio is unreadable without a decoder we
// don't have. If this fails, nothing built on top of it can work.
//
// Results render ON SCREEN (not just console) so it can be run from a phone
// without watching the Metro terminal.
//
// Requires the DEV BUILD (real mic + filesystem), NOT web — in a browser
// expo-audio falls back to MediaRecorder and hands you webm/opus, ignoring
// WAV_OPTIONS entirely. You'd learn a fact about Chrome, not about the phone.
//
// See learning/pronunciation/voice-record-step-lesson.md §8.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { View, Text, Button, ScrollView, Platform } from 'react-native'
import { useAudioRecorder, AudioModule, setAudioModeAsync } from 'expo-audio'
import * as FileSystem from 'expo-file-system/legacy'
import { WAV_OPTIONS } from '../src/lib/recordingOptions.js'
import AdminGate from '../src/components/common/AdminGate.jsx'

const RECORD_MS = 2000

export default function SpikeTest() {
  // WAV_OPTIONS is applied at prepareToRecordAsync() time — the format is decided
  // BEFORE capture, never converted after.
  const recorder = useAudioRecorder(WAV_OPTIONS)
  const [phase, setPhase] = useState('idle') // idle | recording | reading | done
  const [result, setResult] = useState(null)

  // No parameter! RN's Button calls onPress(event) — a `recorder` parameter here
  // would be shadowed by the press event and blow up on prepareToRecordAsync().
  async function runSpike() {
    setResult(null)
    try {
      // 1. Permission — CHECK the result, don't just await it. A denied mic
      //    otherwise surfaces as a confusing prepareToRecordAsync() failure.
      const perm = await AudioModule.requestRecordingPermissionsAsync()
      if (!perm.granted) {
        setResult({ error: 'Mic permission denied — enable it in Settings.' })
        return
      }

      // 2. iOS needs the audio session put into recording mode first.
      await setAudioModeAsync({ allowsRecording: true })

      // 3. Record exactly RECORD_MS.
      setPhase('recording')
      await recorder.prepareToRecordAsync()
      recorder.record()
      await new Promise((r) => setTimeout(r, RECORD_MS))
      await recorder.stop()
      await setAudioModeAsync({ allowsRecording: false }) // restore speaker routing

      const uri = recorder.uri
      if (!uri) { setResult({ error: 'No uri after stop.' }); return }

      // 4. Read the raw bytes. There's no "give me bytes" API, so read the file
      //    as base64 text and convert each character back to its byte value.
      setPhase('reading')
      const b64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' })

      // TWO arguments: Uint8Array.from(source, mapper). Wrapping both in ONE set
      // of parens makes it the comma operator, which discards atob(b64) and
      // silently yields a 1-byte array.
      const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
      const dv = new DataView(bytes.buffer)

      // 5. Inspect the header. A WAV's first 44 bytes are a fixed layout — these
      //    offsets aren't arbitrary:
      //      0-3    "RIFF"       ← container magic
      //      8-11   "WAVE"       ← the RIFF holds audio
      //      20-21  format (1 = uncompressed PCM)
      //      24-27  SAMPLE RATE
      //      34-35  bits per sample
      //      44+    the actual samples ← what the pitch code wants
      //
      //    `true` = LITTLE-ENDIAN, and it must match linearPCMIsBigEndian: false
      //    in recordingOptions.js. Read it the wrong way and you get a
      //    plausible-looking wrong number with no error.
      const riff = String.fromCharCode(...bytes.slice(0, 4))
      const wave = String.fromCharCode(...bytes.slice(8, 12))
      const rate = dv.getUint32(24, true)
      const bits = dv.getUint16(34, true)

      const isWav = riff === 'RIFF' && wave === 'WAVE'

      // Sanity check the SIZE too — a valid-looking header on a tiny file still
      // means compression. 2s of 44.1kHz 16-bit mono ≈ 176 KB.
      const expected = (rate || WAV_OPTIONS.sampleRate) * 2 * (RECORD_MS / 1000)
      const sizeLooksRaw = bytes.length > expected * 0.5

      const payload = { uri, riff, wave, rate, bits, bytes: bytes.length, isWav, sizeLooksRaw }
      setResult(payload)
      console.log(`[spike] ${isWav ? '✅ REAL WAV' : '❌ NOT A WAV'}`, payload)
    } catch (e) {
      // Spikes fail loudly — the failure IS the information we came for.
      console.warn('[spike] failed', e)
      setResult({ error: String(e?.message || e) })
    } finally {
      setPhase('done')
    }
  }

  const busy = phase === 'recording' || phase === 'reading'

  return (
    <AdminGate>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: '700' }}>WAV spike</Text>
        <Text style={{ color: '#666' }}>
          Records {RECORD_MS / 1000}s on {Platform.OS}, then reads the file header.
          Talk while it records.
        </Text>

        <Button
          title={
            phase === 'recording' ? '🔴 Recording…'
            : phase === 'reading' ? 'Reading file…'
            : 'Run spike'
          }
          onPress={runSpike}
          disabled={busy}
        />

        {result?.error && (
          <View style={{ backgroundColor: '#fee', borderRadius: 8, padding: 16 }}>
            <Text style={{ color: '#900', fontWeight: '600' }}>Failed</Text>
            <Text style={{ color: '#900' }}>{result.error}</Text>
          </View>
        )}

        {result && !result.error && (
          <View
            style={{
              backgroundColor: result.isWav ? '#e6f7ed' : '#fdecea',
              borderRadius: 8,
              padding: 16,
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: '700' }}>
              {result.isWav ? '✅ REAL WAV' : '❌ NOT A WAV'}
            </Text>

            <Row k="riff (bytes 0-3)" v={JSON.stringify(result.riff)} ok={result.riff === 'RIFF'} />
            <Row k="wave (bytes 8-11)" v={JSON.stringify(result.wave)} ok={result.wave === 'WAVE'} />
            <Row k="sample rate" v={String(result.rate)} ok={result.rate === WAV_OPTIONS.sampleRate} />
            <Row k="bits/sample" v={String(result.bits)} ok={result.bits === 16} />
            <Row k="file size" v={`${(result.bytes / 1024).toFixed(0)} KB`} ok={result.sizeLooksRaw} />

            {!result.isWav && (
              <Text style={{ color: '#666', fontSize: 12, marginTop: 4 }}>
                "ftyp" means an MP4/3GP container — compressed. The .wav extension
                lies; the header doesn't. Android needs the raw-PCM route (§7).
              </Text>
            )}
            {result.isWav && !result.sizeLooksRaw && (
              <Text style={{ color: '#666', fontSize: 12, marginTop: 4 }}>
                Header says WAV but the file is too small for raw audio — check the
                sample rate and duration.
              </Text>
            )}

            <Text selectable style={{ color: '#999', fontSize: 11, marginTop: 4 }}>
              {result.uri}
            </Text>
          </View>
        )}
      </ScrollView>
    </AdminGate>
  )
}

function Row({ k, v, ok }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
      <Text style={{ color: '#555' }}>{k}</Text>
      <Text style={{ fontWeight: '600' }}>{ok ? '✓' : '✗'} {v}</Text>
    </View>
  )
}
