"use client";

import { useParams } from "next/navigation";
import TrainingDetail from "@/components/trainings/training-detail";

export default function MemberTrainingDetailPage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    return (
        <div className="w-full py-8 px-4">
            <TrainingDetail id={id} />
        </div>
    );
}
