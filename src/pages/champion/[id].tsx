import { NextPage } from "next";
import { RouterOutputs, api } from "~/utils/api";
import Image from "next/image";
import { useRouter } from "next/router";

type BuildBadgeProps = RouterOutputs["build"]["getBuildsByChampionId"][0]
const BuildBadge = ({ description, keystoneId, mythicItemId, winRate }: BuildBadgeProps) => {
	const bgColor = winRate >= 50.0 ? "lime-400" : "red-400";
	return (
		<div className="border-2 rounded p-4 mb-3 flex">
			<Image className="flex-1" src={`/img/items/${mythicItemId}.png`} alt={`Icon for`} width={30} height={30} />
			<Image className="flex-1" src={`/img/runes/${keystoneId}.png`} alt={`Icon for`} width={30} height={30} />
			{description}
			<div>
				<span className={`rounded bg-${bgColor}`}>{`${winRate}%`}</span>
			</div>
		</div>
	);
}

type BuildListProps = { championId: string };
const BuildList = ({ championId }: BuildListProps) => {
	const { data, isLoading } = api.build.getBuildsByChampionId.useQuery({ championId });
	console.log(data);
	if (isLoading) {
		return <div>Loading...</div>
	}
	if (!data || data && data.length === 0) {
		return <div>No builds found.</div>
	}
	return (
		<ul>
			{data.map((build) => {
				return <BuildBadge key={build.id} {...build} />
			}
			)}
		</ul>
	)
}


const Home: NextPage = () => {
	const router = useRouter();
	let { id } = router.query;
	if (!id) {
		return <div>404</div>
	}
	if (Array.isArray(id)) {
		// TODO(reno): see if we can ensure that we only ever have one ID
		id = id[0];
		if (!id) {
			return <div>404</div>;
		}
	}
	const { data, isLoading } = api.champion.getChampionById.useQuery({ id });
	if (isLoading) {
		return <><div>Loading...</div></>
	}
	if (!data) {
		return <><div>Champion not found.</div></>
	}
	return (
		<>
			<div className="flex">
				<Image src={`/img/champ_icons/${data.slug}.jpg`} alt="" width={100} height={100} className="h-32 w-32 rounded-full" />
				<h2 className="font-bold text-3xl ml-10">{data?.name}</h2>
			</div>
			<div className="m-10">placeholder: champ info?</div>
			<div className="flex">
				<BuildList championId={id} />
				<div className="border-2 ml-5 p-20">
					build view
				</div>
			</div>
		</>
	);
};

export default Home;
