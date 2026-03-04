export async function uploadToSignedUrl({ signedUrl, file }) {
  const res = await fetch(signedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type
    },
    body: file
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upload failed: ${res.status} ${text}`);
  }
}