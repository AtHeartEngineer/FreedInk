export function sluggify(name: string) {
	return name
		.toLowerCase()
		.replace(/ /g, '-') // Replace spaces with hyphens
		.replace(/[^a-z0-9-_]/g, ''); // Remove any non-alphanumeric character except hyphen and underscore
}

export function unslug(slug: string) {
	return slug.replace(/-/g, ' ');
}

export async function hashMessage(message: string) {
	const encoder = new TextEncoder();
	const data = encoder.encode(message);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
	// first 32 bytes of the hash
	const hash = hashHex.slice(0, 31);
	console.log(hash);
	return hash;
}
