"use client";

import PublicProfile from "@/components/ui/custom/public-profile";
import { useParams } from "next/navigation";

export default function MemberProfilePage() {
    const params = useParams();
    const id = params?.id as string;

    if (!id) return null;

    return <PublicProfile userId={id} />;
}
