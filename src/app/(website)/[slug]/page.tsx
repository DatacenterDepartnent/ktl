import clientPromise from "@/lib/db";
import { notFound } from "next/navigation";
// import Image from "next/image";

// Import CSS ของ SunEditor
import "suneditor/dist/css/suneditor.min.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPage(slug: string) {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    const page = await db.collection("pages").findOne({ slug });
    return page;
  } catch {
    return null;
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) {
    return notFound();
  }

  return (
    <div className="max-w-7xl mx-auto font-sans pb-20">
      <main className="px-4 mt-4">
        {/* เนื้อหาบทความ */}
        <article
          className="sun-editor-editable prose prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-500"
          dangerouslySetInnerHTML={{ __html: page.content }}
          style={{
            fontFamily: "inherit",
            lineHeight: "1.8",
            color: "#374151",
          }}
        />
      </main>
    </div>
  );
}
