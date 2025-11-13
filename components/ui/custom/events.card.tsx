
import Image from "next/image";
import Link from "next/link";

// Types
export interface EventCardProps {
    imageUrl: string;
    title: string;
    date: string;
    time: string;
    venue: string;
    registerUrl?: string;
    className?: string;
}

export function EventCard({
    imageUrl,
    title,
    date,
    time,
    venue,
    registerUrl,
    className = "",
}: EventCardProps) {
    return (
        <div className={`rounded-lg overflow-hidden shadow-sm bg-[#0A1328] flex flex-col transition hover:shadow-lg ${className}`}>
            {/* Image */}
            <div className="relative w-full h-48">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col px-5 pt-5 pb-7">
                <h4 className="text-xs md:text-sm text-[#5F6282] font-semibold mb-1">Annual Aviation Safety Summit</h4>
                <div className="text-[#C8CBD4] text-sm font-medium mb-1">
                    {date} - {time}
                </div>
                <div className="text-[#C8CBD4] text-xs mb-4">
                    {venue}
                </div>
                <div className="mt-auto">
                    <Link href={registerUrl ?? "#"} passHref>
                        <button
                            className="w-full border border-[#2C3049] text-[#4561FF] hover:bg-[#232B43] rounded py-1.5 text-sm font-semibold transition"
                        >
                            Register
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

