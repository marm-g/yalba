import { prisma } from "../src/server/db";
import champData from "../data/champions.json";
import itemData from "../data/items.json";
import runeData from "../data/runes.json";

async function generateGameModes() {
	const gameModes = [
		{
			id: "11",
			name: "Normal",
			mapId: "11"
		},
		{
			id: "12",
			name: "ARAM",
			mapId: "12"
		}
	];

	for (const { id, name, mapId } of Object.values(gameModes)) {
		await prisma.gameMode.upsert({
			where: {
				id
			},
			create: {
				id,
				name,
				mapId
			},
			update: {}
		});
	}
}


async function generateBuilds() {
	await prisma.build.deleteMany({
		where: {
			gameModeId: "11"
		}
	});
	await prisma.build.createMany({
		data: [
			{
				championId: "142",
				description: "Liandry's & Electrocute",
				winRate: 75.2,
				mythicItemId: "6653",
				gameModeId: "11",
				keystoneId: "8112"
			},
			{
				championId: "142",
				description: "Kraken Slayer & Comet",
				winRate: 24.1,
				mythicItemId: "6672",
				gameModeId: "11",
				keystoneId: "8229"
			}
		]
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
	generateBuilds();
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
