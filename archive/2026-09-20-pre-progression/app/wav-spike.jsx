// ─────────────────────────────────────────────────────────────────────────────
// 🎙️ WAV SPIKE 2 — does @siteed/audio-studio give us real PCM on ANDROID?
//
// Route: /wav-spike   (file-based routing — this file IS the route.)
//
// THE ONE QUESTION: app/spike.jsx already proved expo-audio CANNOT produce PCM
// on Android. This asks the same question of @siteed/audio-studio, which talks
// to Android's lower-level AudioRecord API instead of MediaRecorder.
//
// It does not stop at the header. It runs the ACTUAL pipeline on the ACTUAL
// file — decode → pitch → score — so a green result here means tone scoring
// works on this device, not just that the bytes look plausible.
//
// Results render ON SCREEN (not console) so it can be run from a phone without
// watching the Metro terminal.
//
// Requires the DEV BUILD. On web this proves nothing.
//
// 🗑️ THROWAWAY — delete once the Android format question is settled either way.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { View, Text, ScrollView, Platform } from 'react-native'
import * as FileSystem from 'expo-file-system/legacy'
import TabScreen from '../src/components/TabScreen.jsx'
import AdminGate from '../src/components/common/AdminGate.jsx'
import Button from '../src/components/ui/Button.jsx'
import { usePcmRecorder } from '../src/hooks/usePcmRecorder.js'
import { decodeWav, decodeWavForAnalysis } from '../src/lib/wavDecode.js'
import { extractContour } from '../src/lib/yin.js'

const Row = ({ label, value, good }) => (
  <View className="flex-row justify-between py-1 border-b border-cream-200">
    <Text className="text-xs text-stone-500 flex-1">{label}</Text>
    <Text
      className="text-xs flex-1 text-right"
      style={{ color: good === undefined ? '#57534e' : good ? '#15803d' : '#b91c1c' }}
    >
      {String(value)}
    </Text>
  </View>
)

export default function WavSpike() {
  const { status, uri, info, error, start, stop, playTake, playing } = usePcmRecorder()
  const [analysis, setAnalysis] = useState(null)
  const [busy, setBusy] = useState(false)

  // Everything the pipeline does, with each stage reported separately so a
  // failure names its own stage instead of collapsing into "didn't work".
  const analyze = async () => {
    if (!uri) return
    setBusy(true)
    const out = { stages: [] }
    try {
      // ── stage 1: read bytes ───────────────────────────────────────────────
      const b64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' })
      const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
      out.byteLength = bytes.length
      out.magic = String.fromCharCode(...bytes.slice(0, 4))
      out.form = String.fromCharCode(...bytes.slice(8, 12))
      out.isRiff = out.magic === 'RIFF' && out.form === 'WAVE'
      out.stages.push(['read bytes', true, `${bytes.length} bytes`])

      // ── stage 2: decode ───────────────────────────────────────────────────
      try {
        const raw = decodeWav(bytes)
        out.decodedRate = raw.rate
        out.decodedSamples = raw.samples.length
        out.stages.push(['decodeWav', true, `${raw.samples.length} samples @ ${raw.rate}Hz`])
      } catch (e) {
        out.stages.push(['decodeWav', false, e.message])
        throw e
      }

      // ── stage 3: downsample + pitch ───────────────────────────────────────
      const { samples, rate } = decodeWavForAnalysis(bytes)
      out.stages.push(['downsample', true, `${samples.length} samples @ ${rate}Hz`])

      const contour = extractContour(samples, rate)
      out.points = contour.length
      if (contour.length) {
        const f = contour.map((p) => p.f0).sort((a, b) => a - b)
        out.medianF0 = f[Math.floor(f.length / 2)].toFixed(1)
        out.minF0 = f[0].toFixed(1)
        out.maxF0 = f[f.length - 1].toFixed(1)
      }
      out.stages.push([
        'extractContour',
        contour.length >= 5,
        `${contour.length} voiced frames`,
      ])

      out.ok = contour.length >= 5
    } catch (e) {
      out.error = e.message
      out.ok = false
    }
    setAnalysis(out)
    setBusy(false)
  }

  return (
    <AdminGate>
      <TabScreen>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text className="font-serif text-3xl text-stone-900 mb-1">WAV spike 2 🎙️</Text>
          <Text className="text-stone-600 mb-1">@siteed/audio-studio · pcm_16bit</Text>
          <Text className="text-xs text-stone-500 mb-6">
            platform: {Platform.OS} · {__DEV__ ? 'dev' : 'prod'}
          </Text>

          <Text className="text-xs text-stone-600 mb-4">
            Record ~2 seconds of a steady vowel (&quot;aaah&quot;), then Analyze. Speak at a
            normal pitch — a whisper has no periodic signal to find.
          </Text>

          <Button
            onPress={status === 'recording' ? stop : start}
            disabled={status === 'denied'}
            variant={status === 'recording' ? 'danger' : 'primary'}
          >
            {status === 'recording' ? 'Stop' : uri ? 'Record again' : 'Record'}
          </Button>

          {status === 'denied' && (
            <Text className="text-xs mt-3" style={{ color: '#b91c1c' }}>
              Microphone permission denied.
            </Text>
          )}
          {error && (
            <Text className="text-xs mt-3" style={{ color: '#b91c1c' }}>
              {error}
            </Text>
          )}

          {uri && status !== 'recording' && (
            <View className="flex-row gap-3 mt-3">
              <Button variant="secondary" onPress={playTake} disabled={playing}>
                {playing ? 'Playing…' : 'Play'}
              </Button>
              <Button variant="secondary" onPress={analyze} disabled={busy}>
                {busy ? 'Analyzing…' : 'Analyze'}
              </Button>
            </View>
          )}

          {/* What the LIBRARY says it produced */}
          {info && (
            <View className="mt-6">
              <Text className="text-sm font-semibold text-stone-900 mb-2">
                What the recorder reports
              </Text>
              <Row label="mimeType" value={info.mimeType} good={/wav|pcm/i.test(info.mimeType || '')} />
              <Row label="bitDepth" value={info.bitDepth} good={info.bitDepth === 16} />
              <Row label="sampleRate" value={info.sampleRate} />
              <Row label="channels" value={info.channels} good={info.channels === 1} />
              <Row label="size" value={`${(info.size / 1024).toFixed(0)} KB`} />
              <Row label="durationMs" value={info.durationMs} />
              {/* 2s of 44.1k 16-bit mono ≈ 176 KB. Far smaller = compressed,
                  regardless of what the extension claims. */}
              <Row
                label="≈ uncompressed?"
                value={
                  info.durationMs
                    ? `${((info.size / (info.durationMs / 1000) / 1024)).toFixed(0)} KB/s (expect ~86)`
                    : '—'
                }
                good={info.durationMs ? info.size / (info.durationMs / 1000) > 40000 : undefined}
              />
            </View>
          )}

          {/* What OUR pipeline makes of the actual bytes */}
          {analysis && (
            <View className="mt-6">
              <Text className="text-sm font-semibold text-stone-900 mb-2">
                Pipeline result
              </Text>
              <Row label="magic (0-3)" value={analysis.magic} good={analysis.magic === 'RIFF'} />
              <Row label="form (8-11)" value={analysis.form} good={analysis.form === 'WAVE'} />
              {analysis.decodedRate && <Row label="header rate" value={`${analysis.decodedRate} Hz`} />}
              {analysis.decodedSamples && <Row label="samples" value={analysis.decodedSamples} />}
              {analysis.points !== undefined && (
                <Row label="voiced frames" value={analysis.points} good={analysis.points >= 5} />
              )}
              {analysis.medianF0 && (
                <>
                  <Row label="median F0" value={`${analysis.medianF0} Hz`} good />
                  <Row label="F0 range" value={`${analysis.minF0} – ${analysis.maxF0} Hz`} />
                </>
              )}

              <View className="mt-4">
                {analysis.stages.map(([name, ok, detail], i) => (
                  <Text
                    key={i}
                    className="text-xs mb-1"
                    style={{ color: ok ? '#15803d' : '#b91c1c' }}
                  >
                    {ok ? '✓' : '✗'} {name} — {detail}
                  </Text>
                ))}
              </View>

              <View
                className="mt-4 rounded-md p-4"
                style={{ backgroundColor: analysis.ok ? '#dcfce7' : '#fee2e2' }}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ color: analysis.ok ? '#15803d' : '#b91c1c' }}
                >
                  {analysis.ok
                    ? `PASS — real PCM on ${Platform.OS}. Tone scoring works here.`
                    : `FAIL on ${Platform.OS}`}
                </Text>
                {analysis.error && (
                  <Text className="text-xs mt-2" style={{ color: '#b91c1c' }}>
                    {analysis.error}
                  </Text>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </TabScreen>
    </AdminGate>
  )
}
