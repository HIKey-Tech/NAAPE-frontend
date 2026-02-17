import React from "react";
import { Linkedin, Twitter, Instagram, Facebook, Mail } from "lucide-react";
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
        { id: "linkedin", href: socials?.linkedin, Icon: Linkedin, label: "LinkedIn" },
        { id: "twitter", href: socials?.twitter, Icon: Twitter, label: "Twitter" },
        { id: "instagram", href: socials?.instagram, Icon: Instagram, label: "Instagram" },
        { id: "facebook", href: socials?.facebook, Icon: Facebook, label: "Facebook" },
    ];

    return (
        <div
            className={`flex flex-col items-center ${className}`}
            aria-label={`Leader card for ${name}, ${title}`}
        >
            {/* Photo */}
            <div className="relative w-full aspect-[4/5] overflow-hidden bg-slate-100">
                <Image
                    src={photoSrc}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Info */}
            <div className="p-6 w-full">
                <h3 className="font-bold text-slate-900 text-lg mb-1">{name}</h3>
                <p className="text-sm text-primary font-bold uppercase tracking-wider mb-4">{title}</p>

                {/* Socials */}
                <div className="flex gap-2 mb-4">
                    {socialIcons.map(({ id, href, Icon, label }) =>
                        href ? (
                            <a
                                key={id}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-primary hover:text-white text-slate-400 transition-all"
                            >
                                <Icon size={14} />
                            </a>
                        ) : null
                    )}
                </div>

                {/* Contact */}
                {contactLabel && contactHref && (
                    <a
                        href={contactHref}
                        className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-blue-700 transition-colors"
                    >
                        <Mail size={14} /> {contactLabel}
                    </a>
                )}
            </div>
        </div>
    );
};
