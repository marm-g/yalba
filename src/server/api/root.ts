import { createTRPCRouter } from "~/server/api/trpc";
import { championRouter } from "./routers/champions";
import { buildsRouter } from "./routers/builds";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	champion: championRouter,
	build: buildsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
