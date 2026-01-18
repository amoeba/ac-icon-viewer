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
	item_type: number | null;
}

// ItemType bitflag to name mapping for the dats.treestats.net API
const ITEM_TYPE_NAMES: Record<number, string> = {
	0x1: 'melee_weapon',
	0x2: 'armor',
	0x4: 'clothing',
	0x8: 'jewelry',
	0x10: 'creature',
	0x20: 'food',
	0x40: 'money',
	0x80: 'misc',
	0x100: 'missile_weapon',
	0x200: 'container',
	0x800: 'gem',
	0x1000: 'spell_components',
	0x2000: 'key',
	0x4000: 'caster',
	0x8000: 'portal',
	0x20000: 'promissory_note',
	0x40000: 'mana_stone',
	0x80000: 'service'
};

export function getItemTypeName(itemType: number | null): string | null {
	if (itemType == null) return null;
	return ITEM_TYPE_NAMES[itemType] ?? null;
}

// Background texture IDs for each ItemType (from asheron-rs get_background_from_item_type)
const ITEM_TYPE_BACKGROUND_IDS: Record<number, number> = {
	0x1: 0x060011CB,    // melee_weapon
	0x2: 0x060011CF,    // armor
	0x4: 0x060011F3,    // clothing
	0x8: 0x060011D5,    // jewelry
	0x10: 0x060011D1,   // creature
	0x20: 0x060011CC,   // food
	0x40: 0x060011F4,   // money
	0x80: 0x060011D0,   // misc
	0x100: 0x060011D2,  // missile_weapon
	0x200: 0x060011CE,  // container
	0x800: 0x060011D3,  // gem
	0x1000: 0x060011CD, // spell_components
	0x80000: 0x06005E23 // service
};

export function getItemTypeBackgroundId(itemType: number | null): number | null {
	if (itemType == null) return null;
	return ITEM_TYPE_BACKGROUND_IDS[itemType] ?? 0x060011D4; // default background
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
			underlay.value as icon_underlay,
			item_type.value as item_type
		FROM weenie w
		LEFT JOIN weenie_properties_string s ON w.class_Id = s.object_Id AND s.type = 1
		LEFT JOIN weenie_properties_d_i_d icon ON w.class_Id = icon.object_Id AND icon.type = 8
		LEFT JOIN weenie_properties_d_i_d overlay ON w.class_Id = overlay.object_Id AND overlay.type = 50
		LEFT JOIN weenie_properties_d_i_d overlay2 ON w.class_Id = overlay2.object_Id AND overlay2.type = 51
		LEFT JOIN weenie_properties_d_i_d underlay ON w.class_Id = underlay.object_Id AND underlay.type = 52
		LEFT JOIN weenie_properties_int item_type ON w.class_Id = item_type.object_Id AND item_type.type = 1
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
	underlay?: number | null,
	itemType?: number | null
): string {
	let url = `https://dats.treestats.net/icons/${iconId}?scale=2`;
	if (overlay) url += `&overlay=${overlay}`;
	if (overlay2) url += `&overlay2=${overlay2}`;
	if (underlay) url += `&underlay=${underlay}`;
	const itemTypeName = getItemTypeName(itemType);
	if (itemTypeName) url += `&background=${itemTypeName}`;
	return url;
}
