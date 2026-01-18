const BASE_URL = 'https://acedb.treestats.net/ace_world_patches.json';

export interface WeenieSearchResult {
	class_Id: number;
	class_Name: string;
	name: string | null;
}

export interface WeenieDetail {
	class_Id: number;
	class_Name: string;
	type: number;
	name: string | null;
	icon_id: number | null;
	icon_overlay: number | null;
	icon_overlay2: number | null;
	icon_underlay: number | null;
}

function buildUrl(sql: string): string {
	return `${BASE_URL}?sql=${encodeURIComponent(sql)}&_shape=array`;
}

export async function searchWeenies(query: string): Promise<WeenieSearchResult[]> {
	if (!query.trim()) return [];

	const escapedQuery = query.replace(/'/g, "''");
	const sql = `
		SELECT w.class_Id, w.class_Name, s.value as name
		FROM weenie w
		LEFT JOIN weenie_properties_string s ON w.class_Id = s.object_Id AND s.type = 1
		WHERE s.value LIKE '%${escapedQuery}%' OR w.class_Name LIKE '%${escapedQuery}%'
		LIMIT 20
	`;

	const response = await fetch(buildUrl(sql));
	if (!response.ok) {
		throw new Error(`Search failed: ${response.statusText}`);
	}
	return response.json();
}

export async function getWeenie(classId: number): Promise<WeenieDetail | null> {
	const sql = `
		SELECT w.*, s.value as name,
			icon.value as icon_id,
			overlay.value as icon_overlay,
			overlay2.value as icon_overlay2,
			underlay.value as icon_underlay
		FROM weenie w
		LEFT JOIN weenie_properties_string s ON w.class_Id = s.object_Id AND s.type = 1
		LEFT JOIN weenie_properties_d_i_d icon ON w.class_Id = icon.object_Id AND icon.type = 8
		LEFT JOIN weenie_properties_d_i_d overlay ON w.class_Id = overlay.object_Id AND overlay.type = 50
		LEFT JOIN weenie_properties_d_i_d overlay2 ON w.class_Id = overlay2.object_Id AND overlay2.type = 51
		LEFT JOIN weenie_properties_d_i_d underlay ON w.class_Id = underlay.object_Id AND underlay.type = 52
		WHERE w.class_Id = ${classId}
	`;

	const response = await fetch(buildUrl(sql));
	if (!response.ok) {
		throw new Error(`Fetch failed: ${response.statusText}`);
	}
	const results: WeenieDetail[] = await response.json();
	return results[0] ?? null;
}

export function buildIconUrl(
	iconId: number,
	overlay?: number | null,
	overlay2?: number | null,
	underlay?: number | null
): string {
	let url = `https://dats.treestats.net/icons/${iconId}?scale=2`;
	if (overlay) url += `&overlay=${overlay}`;
	if (overlay2) url += `&overlay2=${overlay2}`;
	if (underlay) url += `&underlay=${underlay}`;
	return url;
}
