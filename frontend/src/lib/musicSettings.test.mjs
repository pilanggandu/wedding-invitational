import test from "node:test";
import assert from "node:assert/strict";
import { getMusicUrlError, getMusicVolume } from "./musicSettings.ts";

test("supports the built-in track, local files, and signed audio URLs", () => {
  for (const url of ["", "  ", "/audio/our-song.mp3", "https://cdn.example.com/song?token=abc", "http://localhost:3000/audio/song.wav"]) {
    assert.equal(getMusicUrlError(url), null, url);
  }
});

test("rejects page links and sources the audio player cannot use", () => {
  for (const url of ["javascript:alert(1)", "file:///song.mp3", "//example.com/song.mp3", "a song.mp3", "https://youtube.com/watch?v=123", "https://youtu.be/123", "https://open.spotify.com/track/123"]) {
    assert.ok(getMusicUrlError(url), url);
  }
});

test("preserves mute and clamps volume without producing NaN", () => {
  assert.equal(getMusicVolume(0), 0);
  assert.equal(getMusicVolume(75), 75);
  assert.equal(getMusicVolume(-1), 0);
  assert.equal(getMusicVolume(150), 100);
  assert.equal(getMusicVolume(undefined), 40);
  assert.equal(getMusicVolume(Number.NaN), 40);
});
