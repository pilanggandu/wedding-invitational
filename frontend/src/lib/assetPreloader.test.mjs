import test from "node:test";
import assert from "node:assert/strict";
import {
  collectInvitationAssets,
  preloadAllAssets,
} from "./assetPreloader.ts";

test("collectInvitationAssets gathers template and custom photos uniquely", () => {
  const dummyData = {
    couple: {
      groom: { name: "Gilang", photoUrl: "/custom-groom.jpg" },
      bride: { name: "Salsa", photoUrl: "/custom-bride.jpg" },
    },
    general: {
      heroPhotoUrl: "/custom-hero.jpg",
      coverPhotoUrl: "/custom-cover.jpg",
      preweddingPhotos: ["/pw-1.jpg", "/pw-2.jpg"],
    },
    gallery: [
      { id: 1, caption: "Photo 1", tag: "", doodleSticker: "", stickerBg: "", aspectRatio: "square", imageUrl: "/gal-1.jpg" },
      { id: 2, caption: "Photo 2", tag: "", doodleSticker: "", stickerBg: "", aspectRatio: "square", imageUrl: "/gal-2.jpg" },
    ],
  };

  const assets = collectInvitationAssets(dummyData);
  assert.ok(assets.length >= 10);
  assert.ok(assets.includes("/custom-groom.jpg"));
  assert.ok(assets.includes("/custom-bride.jpg"));
  assert.ok(assets.includes("/custom-hero.jpg"));
  assert.ok(assets.includes("/pw-1.jpg"));
  assert.ok(assets.includes("/gal-1.jpg"));
  assert.ok(assets.includes("/images/paper-art/deckle-photo-mat.png"));
});

test("collectInvitationAssets handles empty or undefined data gracefully", () => {
  assert.deepEqual(collectInvitationAssets(undefined), []);
  const assets = collectInvitationAssets({});
  assert.ok(assets.length > 0);
});

test("preloadAllAssets handles empty list immediately", async () => {
  let progressCalled = false;
  await preloadAllAssets([], (pct) => {
    progressCalled = true;
    assert.equal(pct, 100);
  });
  assert.equal(progressCalled, true);
});

test("preloadAllAssets completes within timeout in non-browser environment", async () => {
  const urls = ["/test1.jpg", "/test2.jpg"];
  let finalPct = 0;
  await preloadAllAssets(urls, (pct) => {
    finalPct = pct;
  });
  assert.equal(finalPct, 100);
});
