"use client";
import ForumThreadList from "@/components/ui/custom/forum-thread-list";
import { useParams } from "next/navigation";

const CategoryPage = () => {
    const params = useParams();
    const categoryId = params?.categoryId as string;

    return <ForumThreadList categoryId={categoryId} />;
};

export default CategoryPage;
