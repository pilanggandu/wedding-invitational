/**
 * Utility untuk upload gambar ke server (/api/upload-image)
 * dengan fallback kompresi canvas jika upload server terkendala (offline / dev mode).
 */

export async function compressImageToDataUrl(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve("");
    }, 4000);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        clearTimeout(timeout);
        resolve("");
        return;
      }

      const img = new Image();
      img.onload = () => {
        clearTimeout(timeout);
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(result);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        try {
          const compressed = canvas.toDataURL("image/jpeg", quality);
          resolve(compressed);
        } catch {
          resolve(result);
        }
      };
      img.onerror = () => {
        clearTimeout(timeout);
        resolve(result);
      };
      img.src = result;
    };
    reader.onerror = () => {
      clearTimeout(timeout);
      resolve("");
    };
    reader.readAsDataURL(file);
  });
}

export async function uploadImageFile(file: File): Promise<string> {
  // 1. Coba upload langsung ke endpoint Next.js /api/upload-image
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.url) {
        // Preload gambar ke cache browser agar langsung tersedia
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = data.url;
          setTimeout(resolve, 1500);
        });
        return data.url;
      }
    }
  } catch (err) {
    console.warn("Upload image ke server gagal, menggunakan kompresi lokal:", err);
  }

  // 2. Fallback kompresi canvas lokal agar tidak melebihi kuota 5MB localStorage
  return await compressImageToDataUrl(file);
}
