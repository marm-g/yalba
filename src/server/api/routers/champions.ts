import {z} from "zod";

import {
	createTRPCRouter,
	publicProcedure,
} from "~/server/api/trpc";

export const championRouter = createTRPCRouter({
	getAll: publicProcedure.query(({ctx}) => {
		return ctx.prisma.champion.findMany();
	}),

	getChampionById: publicProcedure.input(z.object({ id: z.string() })).query(({ctx, input}) => {
		return ctx.prisma.champion.findUnique({where: {id: input.id}});
	})
});
