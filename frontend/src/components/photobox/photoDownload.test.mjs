import test from "node:test";
import assert from "node:assert/strict";
import { isIOSDevice, isInAppBrowser } from "./photoDownload.ts";

test("isIOSDevice detects iPhone and iPad user agents", () => {
  // Test iPhone UA
  const iphoneUa = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15";
  assert.ok(/iPad|iPhone|iPod/.test(iphoneUa));

  // Test iPad UA
  const ipadUa = "Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15";
  assert.ok(/iPad|iPhone|iPod/.test(ipadUa));

  // Test Android UA (not iOS)
  const androidUa = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36";
  assert.ok(!/iPad|iPhone|iPod/.test(androidUa));
});

test("isInAppBrowser detects common mobile webviews", () => {
  const instagramUa = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Instagram 300.0.0";
  assert.ok(instagramUa.toLowerCase().includes("instagram"));

  const tiktokUa = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 BytedanceWebview TikTok";
  assert.ok(tiktokUa.toLowerCase().includes("tiktok"));

  const standardSafariUa = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
  assert.ok(!standardSafariUa.toLowerCase().includes("instagram"));
  assert.ok(!standardSafariUa.toLowerCase().includes("tiktok"));
});

test("PhotoDownloadOptions accepts precomputedBlob and precomputedFile", () => {
  const dummyBlob = { size: 1024, type: "image/png" };
  const dummyFile = { name: "photobox.png", size: 1024, type: "image/png" };
  const opts = {
    filename: "test.png",
    precomputedBlob: dummyBlob,
    precomputedFile: dummyFile,
  };
  assert.strictEqual(opts.filename, "test.png");
  assert.strictEqual(opts.precomputedBlob, dummyBlob);
  assert.strictEqual(opts.precomputedFile, dummyFile);
});
