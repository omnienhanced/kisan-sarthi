const API_URL = "http://127.0.0.1:8000/api"

export async function uploadDocument(
  formData: FormData,
  token: string
) {
  const res = await fetch(`${API_URL}/documents/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!res.ok) {
    throw new Error(await res.text())
  }
}

export async function getDocuments(token: string) {
  const res = await fetch(`${API_URL}/documents/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error(await res.text())
  }

  return res.json()
}

export async function deleteDocument(
  docId: string,
  token: string
) {
  const res = await fetch(`${API_URL}/documents/${docId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error(await res.text())
  }
}
