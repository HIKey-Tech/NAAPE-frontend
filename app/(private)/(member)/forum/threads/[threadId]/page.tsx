"use client";
import ForumThreadDetail from "@/components/ui/custom/forum-thread-detail";
import { useParams } from "next/navigation";

const ThreadDetailPage = () => {
    const params = useParams();
    const threadId = params?.threadId as string;

    return <ForumThreadDetail threadId={threadId} />;
};

export default ThreadDetailPage;
