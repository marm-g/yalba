import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import Image from "next/image";
import { useRouter } from "next/router";

const BuildBadge = ({}) => {
	
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
				<Image src={`/champ_icons/${data.slug}.jpg`} alt="" width={100} height={100} className="h-32 w-32 rounded-full" />
				<h2 className="font-bold text-3xl ml-10">{data?.name}</h2>
			</div>
			<div className="m-10">placeholder: champ info?</div>
			<div className="flex">
				<ul>
				</ul>
				<div className="border-2 ml-5 p-20">
					build view
				</div>
			</div>
		</>
	);
};

export default Home;
