import confetti from "canvas-confetti";

/**
 * Memicu pesta konfeti dan kelopak kertas berpalet Paper Keepsake:
 * - Rose petal (#C7887D)
 * - Warm gold (#E5B869)
 * - Metallic gold (#D4AF37)
 * - Ivory paper (#FBF8F1)
 * - Sage leaf (#79806B)
 */
export function triggerKeepsakeCelebration(reduced = false) {
  if (reduced || typeof window === "undefined") return;

  try {
    // Volley 1: Pancuran konfeti & kelopak dari tengah bawah
    confetti({
      particleCount: 75,
      spread: 85,
      startVelocity: 44,
      origin: { y: 0.64 },
      colors: [
        "#C7887D",
        "#E5B869",
        "#D4AF37",
        "#FBF8F1",
        "#79806B",
        "#DDB0A3",
        "#E4D4B8",
      ],
      ticks: 280,
      gravity: 0.85,
      scalar: 1.15,
      shapes: ["circle", "square"],
    });

    // Volley 2: Meriam ganda dari sisi kiri dan kanan (efek meriah berlapis)
    window.setTimeout(() => {
      confetti({
        particleCount: 45,
        angle: 60,
        spread: 65,
        startVelocity: 36,
        origin: { x: 0.08, y: 0.7 },
        colors: ["#C7887D", "#E5B869", "#FBF8F1", "#79806B"],
        ticks: 240,
        gravity: 0.75,
        scalar: 1.0,
      });

      confetti({
        particleCount: 45,
        angle: 120,
        spread: 65,
        startVelocity: 36,
        origin: { x: 0.92, y: 0.7 },
        colors: ["#C7887D", "#D4AF37", "#FBF8F1", "#79806B"],
        ticks: 240,
        gravity: 0.75,
        scalar: 1.0,
      });
    }, 280);
  } catch {
    // Canvas confetti gagal secara aman jika lingkungan tidak mendukung
  }
}
