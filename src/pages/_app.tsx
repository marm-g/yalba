import {type AppType} from "next/app";
import {type Session} from "next-auth";
import {SessionProvider} from "next-auth/react";

import {api} from "~/utils/api";

import "~/styles/globals.css";
import {Header} from "~/components/header";

const MyApp: AppType<{session: Session | null}> = ({
	Component,
	pageProps: {session, ...pageProps},
}) => {
	return (
		<SessionProvider session={session}>
			<main className="p-10">
				<Header />
				<Component {...pageProps} />
			</main>
		</SessionProvider>
	);
};

export default api.withTRPC(MyApp);
