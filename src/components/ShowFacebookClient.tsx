"use client";

import dynamic from "next/dynamic";

const ShowFacebook = dynamic(() => import("@/components/ShowFacebook"), {
  ssr: false,
});

export default function ShowFacebookClient() {
  return <ShowFacebook />;
}
