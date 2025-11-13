import React from "react";
import { NaapButton } from "./button.naap";
import { Linkedin, Twitter, Instagram, Facebook } from "lucide-react";
import Image from "next/image";

export interface LeaderCardProps {
    name: string;
    title: string;
    photoSrc: string;
    socials?: {
        linkedin?: string;
        twitter?: string;
        instagram?: string;
        facebook?: string;
    };
    contactLabel?: string;
    onContact?: () => void;
    contactHref?: string;
    className?: string;
}

/**
 * LeaderCard
 * - Reusable component to display a leadership/profile card
 * - Shows: Profile photo, Name, Title, Social icons, CTA button
 */
export const LeaderCard: React.FC<LeaderCardProps> = ({
    name,
    title,
    photoSrc,
    socials,
    contactLabel = "Contact",
    onContact,
    contactHref,
    className = "",
}) => {
    // Helper for rendering icons
    const socialIcons = [
        {
            id: "linkedin",
            href: socials?.linkedin,
            Icon: Linkedin,
            label: "LinkedIn",
            colorClass: "hover:text-blue-700",
        },
        {
            id: "twitter",
            href: socials?.twitter,
            Icon: Twitter,
            label: "Twitter",
            colorClass: "hover:text-blue-400",
        },
        {
            id: "instagram",
            href: socials?.instagram,
            Icon: Instagram,
            label: "Instagram",
            colorClass: "hover:text-pink-500",
        },
        {
            id: "facebook",
            href: socials?.facebook,
            Icon: Facebook,
            label: "Facebook",
            colorClass: "hover:text-blue-600",
        },
    ];

    return (
        <div
            className={`
                flex flex-col items-center bg-white rounded-xl shadow-md p-6
                transition-shadow duration-300 hover:shadow-xl
                ${className}
            `}
            tabIndex={0}
            aria-label={`Leader card for ${name}, ${title}`}
            role="region"
        >
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-[#F2F3F7] shadow-sm">
                <Image
                    src={photoSrc}
                    alt={name}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                    priority
                />
            </div>
            <div className="text-center">
                <div className="font-semibold text-neutral-900 text-lg leading-snug">{name}</div>
                <div className="text-sm text-neutral-500 mb-3">{title}</div>
                <div className="flex justify-center gap-2 mb-4" aria-label="Leader social links">
                    {socialIcons.map(
                        ({ id, href, Icon, label, colorClass }) =>
                            href && (
                                <a
                                    key={id}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className={`outline-none focus:ring-2 focus:ring-blue-400 rounded transition ${colorClass}`}
                                    tabIndex={0}
                                >
                                    <Icon size={21} className="text-gray-500 transition" />
                                </a>
                            )
                    )}
                </div>
                {contactLabel && (
                    contactHref ? (
                        <a
                            href={contactHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            tabIndex={0}
                            className="inline-block"
                        >
                            <NaapButton
                                className="px-5 border-[#D9D9D9] font-medium text-sm min-w-[115px]"
                                variant="ghost"
                            >
                                {contactLabel}
                            </NaapButton>
                        </a>
                    ) : (
                        <NaapButton
                            className="px-5 border-[#D9D9D9] font-medium text-sm min-w-[115px]"
                            variant="ghost"
                            onClick={onContact}
                            tabIndex={0}
                        >
                            {contactLabel}
                        </NaapButton>
                    )
                )}
            </div>
        </div>
    );
};
