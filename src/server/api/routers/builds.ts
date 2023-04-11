import {z} from "zod";

import {
	createTRPCRouter,
	publicProcedure,
} from "~/server/api/trpc";

export const buildsRouter = createTRPCRouter({
	getBuildsByChampionId: publicProcedure.input(z.object({ championId: z.string() })).query(({ctx, input}) => {
		return ctx.prisma.build.findMany({where: {championId: input.championId}});
	})
});
