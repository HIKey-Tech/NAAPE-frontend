"use client";
import ForumThreadForm from "@/components/ui/custom/forum-thread-form";
import { useParams } from "next/navigation";

const EditThreadPage = () => {
    const params = useParams();
    const threadId = params?.threadId as string;

    return <ForumThreadForm threadId={threadId} />;
};

export default EditThreadPage;
