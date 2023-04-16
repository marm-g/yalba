import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import Image from "next/image";
import { useState } from "react";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";

type Build = RouterOutputs["build"]["getBuildsByChampionId"][0];

type BuildBadgeProps = Build & {
  isActive: boolean;
  onBuildChange: (buildId: string) => void;
};
const BuildBadge = ({
  description,
  keystoneId,
  mythicItemId,
  winRate,
  id,
  onBuildChange,
  isActive,
}: BuildBadgeProps) => {
  // TODO(reno): change based on isActive
  const bgColor = winRate >= 50.0 ? "lime-400" : "red-400";
  return (
    <button
      onClick={() => onBuildChange(id)}
      className={`mb-3 flex rounded border-2 p-4 ${
        isActive ? "bg-blue-200" : ""
      }`}
    >
      <Image
        className="flex-1"
        src={`/img/items/${mythicItemId}.png`}
        alt={`Icon for`}
        width={30}
        height={30}
      />
      <Image
        className="flex-1"
        src={`/img/runes/${keystoneId}.png`}
        alt={`Icon for`}
        width={30}
        height={30}
      />
      {description}
      <div>
        <span className={`rounded bg-${bgColor}`}>{`${winRate}%`}</span>
      </div>
    </button>
  );
};

type BuildListProps = {
  builds: Build[];
  activeBuild: string;
  onBuildChange: (buildId: string) => void;
};
const BuildList = ({ builds, activeBuild, onBuildChange }: BuildListProps) => {
  return (
    <ul>
      {builds.map((build) => {
        return (
          <BuildBadge
            key={build.id}
            {...build}
            isActive={activeBuild === build.id}
            onBuildChange={onBuildChange}
          />
        );
      })}
    </ul>
  );
};

const AbilityRow = ({
  abilityLetter,
  abilityOrder,
}: {
  abilityLetter: string;
  abilityOrder: string[];
}) => {
  return (
    <>
      <div className="border p-2">{abilityLetter}</div>
      {abilityOrder.map((ability, i) => {
        const abilityMatch = ability === abilityLetter;
        return (
          <div
            className={`border p-2 ${abilityMatch ? "bg-lime-200" : ""}`}
            key={i}
          >
            {abilityMatch ? "X" : " "}
          </div>
        );
      })}
    </>
  );
};

const BuildView = ({ build }: { build: Build }) => {
  return (
    <div className="ml-5 grid grid-cols-19 border-2 p-20">
      <AbilityRow abilityLetter="Q" abilityOrder={build.abilityOrder} />
      <AbilityRow abilityLetter="W" abilityOrder={build.abilityOrder} />
      <AbilityRow abilityLetter="E" abilityOrder={build.abilityOrder} />
      <AbilityRow abilityLetter="R" abilityOrder={build.abilityOrder} />
    </div>
  );
};

const BuildsWrapper = ({ championId }: { championId: string }) => {
  const { data: builds } = api.build.getBuildsByChampionId.useQuery({
    championId,
  });
  const [activeBuild, setActiveBuild] = useState<string>(
    builds && builds[0] ? builds[0].id : ""
  );

  // TODO(reno): I believe this should never run. Can I eliminate this path?
  if (!builds) {
    return <div>404</div>;
  }
  const activeBuildObject = builds.find((build) => build.id === activeBuild);

  return (
    <>
      <div className="flex">
        <BuildList
          builds={builds}
          activeBuild={activeBuild}
          onBuildChange={(buildId) => setActiveBuild(buildId)}
        />
        {activeBuildObject && <BuildView build={activeBuildObject} />}
      </div>
    </>
  );
};

const ChampionPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.champion.getChampionById.useQuery({ id });
  if (!data) {
    // this should never happen
    return <div>Champion not found.</div>;
  }
  return (
    <>
      <div className="mb-10 flex">
        <Image
          src={`/img/champ_icons/${data.slug ?? ""}.jpg`}
          alt=""
          width={100}
          height={100}
          className="h-32 w-32 rounded-full"
        />
        <h2 className="ml-10 text-3xl font-bold">{data.name}</h2>
      </div>
      <BuildsWrapper championId={id} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, session: null },
    transformer: superjson,
  });
  const id = context.params?.id as string;
  await helpers.champion.getChampionById.prefetch({ id });
  await helpers.build.getBuildsByChampionId.prefetch({ championId: id });
  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const champions = await prisma.champion.findMany({
    select: {
      id: true,
    },
  });
  return {
    paths: champions.map((champion) => ({
      params: {
        id: champion.id,
      },
    })),
    fallback: "blocking",
  };
};

export default ChampionPage;
