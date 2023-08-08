import { cssBundleHref } from "@remix-run/css-bundle"
import type { LoaderArgs, LinksFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from "@remix-run/react"

import type { SupabaseClient } from "@supabase/supabase-js"
import { createClient } from "@supabase/supabase-js"
import { useState } from "react"

import type { Database } from "../db_types"

type TypedSupabaseClient = SupabaseClient<Database>

export type SupabaseOutletContext = {
	supabase: TypedSupabaseClient
}

// export const links: LinksFunction = () => [
// 	...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
// ]

export const links: LinksFunction = () => {
	const linksArray = []

	if (cssBundleHref) {
		linksArray.push({ rel: "stylesheet", href: cssBundleHref })
	}

	return linksArray
}

export const loader = async ({}: LoaderArgs) => {
	const env = {
		SUPABASE_URL: process.env.SUPABASE_URL!,
		SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
	}

	return json({ env })
}

export default function App() {
	const { env } = useLoaderData<typeof loader>()

	const [supabase] = useState(() =>
		createClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
	)

	return (
		<html lang='en'>
			<head>
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width,initial-scale=1' />
				<Meta />
				<Links />
			</head>
			<body>
				<Outlet context={{ supabase }} />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}
