"use client";

import { PostComposer } from "@/components/post-composer";
import { AuthGuard } from "@/components/auth-guard";

export default function NewPostPage() {
  return (
    <AuthGuard>
      <div className="p-6">
        <PostComposer />
      </div>
    </AuthGuard>
  );
}
