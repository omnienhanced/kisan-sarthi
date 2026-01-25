const API_URL = "http://127.0.0.1:8000"

export async function uploadDocument(
  formData: FormData,
  token: string
) {
  await fetch(`${API_URL}/documents/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
}

export async function getDocuments() {
  const res = await fetch(`${API_URL}/documents/my`)
  return res.json()
}

export async function deleteDocument(docId: string) {
  await fetch(`${API_URL}/documents/${docId}`, {
    method: "DELETE",
  })
}
