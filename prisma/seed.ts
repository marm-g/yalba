import { prisma } from "../src/server/db";
import champData from "../data/champions.json";
import itemData from "../data/items.json";
import runeData from "../data/runes.json";

async function generateGameModes() {
	const gameModes = [
		{
			name: "Normal",
			mapId: "11"
		},
		{
			name: "ARAM",
			mapId: "12"
		}
	];

	await prisma.gameMode.createMany({
		data: gameModes
	});
}


async function main() {
	generateGameModes();
	for (const { key, name, id } of Object.values(champData.data)) {
		await prisma.champion.upsert({
			where: {
				id: key,
			},
			create: {
				id: key,
				slug: id,
				name
			},
			update: {},
		});
	}
	for (const [id, { name, plaintext }] of Object.entries(itemData.data)) {
		await prisma.item.upsert({
			where: {
				id,
			},
			create: {
				id,
				name,
				description: plaintext,
				itemType: "NotImplemented"
			},
			update: {}
		});
	}
	for (const { name, slots } of runeData) {
		const tree = name;
		let i = 0;
		for (const { runes } of slots) {
			for (const { name, id, key, shortDesc } of runes) {
				await prisma.rune.upsert({
					where: {
						id: id.toString()
					},
					create: {
						id: id.toString(),
						name,
						slug: key,
						description: shortDesc,
						tree,
						depth: i
					},
					update: {}
				});
			}
			i++;
		}
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
