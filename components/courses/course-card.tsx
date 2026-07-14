"use client";

import { Course } from "@/app/api/courses/courses";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Layers, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CourseCard({ course, hrefBase = "/courses" }: { course: Course; hrefBase?: string }) {
    const price = course.isPaid
        ? `${course.currency === "NGN" ? "₦" : course.currency}${course.price.toLocaleString()}`
        : "Free";
    const completed = !!course.progress?.completedAt;

    return (
        <Link
            href={`${hrefBase}/${course._id}`}
            className="group bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
        >
            <div className="relative h-44 bg-slate-100 overflow-hidden">
                {course.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-slate-300">
                        <BookOpen size={40} />
                    </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className={course.isPaid ? "bg-amber-600" : "bg-slate-600"}>{price}</Badge>
                    {completed && (
                        <Badge className="bg-green-600 flex items-center gap-1">
                            <CheckCircle2 size={12} /> Completed
                        </Badge>
                    )}
                </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2">{course.title}</h3>
                {course.description && (
                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">{course.description}</p>
                )}
                <div className="mt-auto flex items-center gap-2 text-sm text-slate-600">
                    <Layers size={14} className="text-slate-400" />
                    {course.moduleCount} module{course.moduleCount === 1 ? "" : "s"}
                </div>
            </div>
        </Link>
    );
}
