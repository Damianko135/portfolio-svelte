/**
 * Generate a deterministic UUID v5 from a URL
 * Same URL will always generate the same UUID
 * Uses SHA-1 hashing as per UUID v5 spec
 */
export async function urlToUuid(url: string): Promise<string> {
	// Normalize the URL to ensure consistency
	const normalizedUrl = url.toLowerCase().trim();

	// Use Web Crypto API to hash the URL
	const encoder = new TextEncoder();
	const data = encoder.encode(normalizedUrl);
	const hashBuffer = await crypto.subtle.digest('SHA-1', data);

	// Convert to byte array
	const hashArray = Array.from(new Uint8Array(hashBuffer));

	// UUID v5 format: xxxxxxxx-xxxx-5xxx-yxxx-xxxxxxxxxxxx
	// Set version (5) and variant bits
	if (hashArray[6] !== undefined && hashArray[8] !== undefined) {
		hashArray[6] = (hashArray[6] & 0x0f) | 0x50; // Version 5
		hashArray[8] = (hashArray[8] & 0x3f) | 0x80; // Variant
	}

	// Format as UUID string
	const hex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
	return [
		hex.substring(0, 8),
		hex.substring(8, 12),
		hex.substring(12, 16),
		hex.substring(16, 20),
		hex.substring(20, 32)
	].join('-');
}
