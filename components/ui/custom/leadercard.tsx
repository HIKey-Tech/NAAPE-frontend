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
 * - Reusable component for leadership/profile visuals
 * - Improved for aesthetic ambiguity & visual storytelling
 * - No shadows, no gradients. Emphasis on hierarchy & contrast.
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
    const socialIcons = [
        {
            id: "linkedin",
            href: socials?.linkedin,
            Icon: Linkedin,
            label: "LinkedIn",
            colorClass: "hover:text-blue-800 focus:text-blue-900",
        },
        {
            id: "twitter",
            href: socials?.twitter,
            Icon: Twitter,
            label: "Twitter",
            colorClass: "hover:text-sky-500 focus:text-sky-600",
        },
        {
            id: "instagram",
            href: socials?.instagram,
            Icon: Instagram,
            label: "Instagram",
            colorClass: "hover:text-pink-600 focus:text-pink-700",
        },
        {
            id: "facebook",
            href: socials?.facebook,
            Icon: Facebook,
            label: "Facebook",
            colorClass: "hover:text-blue-700 focus:text-blue-800",
        },
    ];

    // Gentle story motif: sepia/cream background, gentle borders only
    // No shadows or gradients; emphasize tactile, print-like feel

    return (
        <div
            className={`
                flex flex-col items-center p-0
                bg-[#F8F5F0] border border-neutral-200 rounded-xl
                ${className}
                transition-colors duration-300
                focus-within:ring-2 focus-within:ring-[#806040]/40
            `}
            tabIndex={0}
            aria-label={`Leader card for ${name}, ${title}`}
            role="region"
            style={{ boxShadow: "none" }}
        >
            <div className="relative w-32 h-32 rounded-full overflow-hidden mt-7 mb-4 border-[3px] border-[#eadbbd] bg-[#e7dac6]">
                {/* Slight sepia-tinted backdrop for visual storytelling/ambiguity */}
                <Image
                    src={photoSrc}
                    alt={name}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full mix-blend-multiply"
                    priority
                />
                {/* Subtle visual motif? A faded ring or strip */}
                <span
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-[4px] rounded-full bg-[#e2c897]/60 opacity-70"
                    aria-hidden="true"
                />
            </div>
            <div className="flex-1 flex flex-col items-center justify-between py-0 px-6 w-full">
                <div className="font-extrabold text-[#2c2824] text-xl leading-tight mb-1 tracking-wide">
                    {name}
                </div>
                <div className="uppercase text-xs tracking-widest font-medium text-[#9C7941] mb-3">
                    {title}
                </div>
                {/* Socials */}
                <div className="flex justify-center gap-2 mb-6 mt-1" aria-label="Leader social links">
                    {socialIcons.map(
                        ({ id, href, Icon, label, colorClass }) =>
                            href && (
                                <a
                                    key={id}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className={`outline-none focus-visible:ring-2 focus-visible:ring-[#dac077]/70 rounded-full transition ${colorClass} p-[5px]`}
                                    tabIndex={0}
                                    style={{ background: "none" }}
                                >
                                    <Icon size={22} className="text-neutral-500 transition-colors duration-150" />
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
                            className="inline-block mt-auto"
                        >
                            <NaapButton
                                className="px-5 border-[#dacaa7] text-[#82673e] font-bold text-sm min-w-[115px] shadow-none bg-transparent hover:bg-[#ede3cb] hover:text-[#56451e] transition-colors"
                                variant="ghost"
                                style={{ boxShadow: "none", background: "none" }}
                            >
                                {contactLabel}
                            </NaapButton>
                        </a>
                    ) : (
                        <NaapButton
                            className="px-5 border-[#dacaa7] text-[#82673e] font-bold text-sm min-w-[115px] shadow-none bg-transparent hover:bg-[#ede3cb] hover:text-[#56451e] transition-colors"
                            variant="ghost"
                            onClick={onContact}
                            tabIndex={0}
                            style={{ boxShadow: "none", background: "none" }}
                        >
                            {contactLabel}
                        </NaapButton>
                    )
                )}
                {/* Motif line, print-like divider, for ambiguity */}
                <div className="w-[52%] h-[2px] bg-[#e3d5bc] mt-7 mb-2 opacity-70 rounded-full" aria-hidden="true" />
            </div>
        </div>
    );
};
