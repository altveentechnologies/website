import { AdminShell } from "../../admin-shell";
import { PostEditor } from "../post-editor";

export const dynamic = "force-dynamic";

export default function NewPostPage() {
  return (
    <AdminShell
      title="New post"
      description="It goes live on /blogs as soon as you save it as published."
    >
      <PostEditor />
    </AdminShell>
  );
}
