import { notFound } from "next/navigation";

import { getPostById } from "@/lib/posts";
import { AdminShell } from "../../admin-shell";
import { PostEditor } from "../post-editor";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) notFound();

  return (
    <AdminShell title="Edit post" description={`/blogs/${post.slug}`}>
      <PostEditor post={post} />
    </AdminShell>
  );
}
