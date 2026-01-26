

import Newsletter from "./newsletter/page";
import PressRelease from "./pressrelease/page";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="grow">
        <PressRelease />
        <Newsletter />
      </main>
    </div>
  );
}
