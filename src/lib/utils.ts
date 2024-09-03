export function slug(name: string) {
	return name.toLowerCase().replace(/ /g, '-');
}
export function unslug(slug: string) {
	return slug.replace(/-/g, ' ');
}
