// src/services/api.ts
export const API_URL = import.meta.env.VITE_API_URL || "https://casamento-maysa-bruno-backend--victorwiniciusb.replit.app";

export async function uploadPhoto(formData: FormData) {
	const response = await fetch(`${API_URL}/upload`, {
		method: "POST",
		body: formData,
	});

	if (!response.ok) {
		throw new Error("Upload failed");
	}

	return response.json();
}

export async function getPhotos() {
	const response = await fetch(`${API_URL}/photos`);

	if (!response.ok) {
		throw new Error("Failed to fetch photos");
	}

	return response.json();
}