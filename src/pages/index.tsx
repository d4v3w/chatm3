import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

export default function Home() {
  const hello = api.post.ping.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>chatm3</title>
        <meta name="description" content="chatm3" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <article className="grid min-h-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            chat<span className="text-[hsl(280,100%,70%)]">m3</span>
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="/chat"
            >
              <h3 className="text-2xl font-bold">Chat →</h3>
              <div className="text-lg">Start chatm3 now.</div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="/faq"
            >
              <h3 className="text-2xl font-bold">FAQ →</h3>
              <div className="text-lg">Learn more about chatm3.</div>
            </Link>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello.data
                ? hello.data.greeting
                : "Loading chatm3 via tRPC client..."}
            </p>
            <AuthShowcase />
          </div>
        </div>
      </article>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.post.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="grid grid-cols-1 items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Hi {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
