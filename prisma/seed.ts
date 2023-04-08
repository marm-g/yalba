import {prisma} from "../src/server/db";
import champData from "../data/champions.json";

async function main() {
	for (const {key, name} of Object.values(champData.data)) {
		await prisma.champion.upsert({
			where: {
				id: key,
			},
			create: {
				id: key,
				name
			},
			update: {},
		});
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
