"use client";

import { useParams } from "next/navigation";
import CourseDetail from "@/components/courses/course-detail";

export default function MemberCourseDetailPage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    return (
        <div className="w-full py-8 px-4">
            <CourseDetail id={id} />
        </div>
    );
}
