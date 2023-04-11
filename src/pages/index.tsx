import { NextPage } from "next";
import Link from "next/link";
import { RouterOutputs, api } from "~/utils/api";
import Image from "next/image";

type GetChampion = RouterOutputs["champion"]["getAll"][0]
const ChampionIcon = ({ id, name, slug }: GetChampion) => {
	return (
		<div>
			<Link href={`/champion/${id}`}>
				<Image alt={`Champion portrait of ${name}`} src={`/img/champ_icons/${slug}.jpg`} width={100} height={100} className="h-32 w-32 rounded-full" />
			</Link>
			<h3>{name}</h3>
		</div>
	);
}

const Home: NextPage = () => {
	const { data } = api.champion.getAll.useQuery();

	return (
		<>
			<div className="p-2 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
				{data?.map((champion) => <ChampionIcon key={champion.id} {...champion} />)}
			</div>
		</>
	);
};

export default Home;
