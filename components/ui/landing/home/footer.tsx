
import Link from "next/link";
import Image from "next/image";
import { FaYoutube, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-primary text-white text-sm w-full mt-auto pt-12 pb-4 px-4 md:px-16 transition-all">
            {/* Top Section */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-10 md:gap-20 mb-10 relative">

                {/* Brand + Title */}
                <div className="flex flex-row items-center gap-5 mb-7 md:mb-0">
                    <Image
                        src="/logo.png"
                        alt="NAAPE Logo"
                        height={56}
                        width={56}
                        priority
                        className="h-14 w-14 bg-white rounded-lg object-contain border-2 border-[#FFD600]"
                    />
                    <span className="text-lg font-bold leading-tight text-white tracking-wide">
                        <span className="block">The National Association of</span>
                        <span className="block">Aircraft Pilots and Engineers</span>
                    </span>
                </div>

                {/* Quick Links */}
                <nav aria-label="Footer Quick Links">
                    <span className="uppercase tracking-widest font-extrabold text-[#FFD600] mb-4 block text-base">Quick Links</span>
                    <ul className="flex flex-col gap-2 text-base font-medium">
                        <li>
                            <Link href="/" className="hover:text-[#FFD600] focus:text-[#FFD600] transition-colors">Home</Link>
                        </li>
                        <li>
                            <Link href="/about" className="hover:text-[#FFD600] focus:text-[#FFD600] transition-colors">About Us</Link>
                        </li>
                        <li>
                            <Link href="/news/naape" className="hover:text-[#FFD600] focus:text-[#FFD600] transition-colors">News</Link>
                        </li>
                        <li>
                            <Link href="/publications/naape" className="hover:text-[#FFD600] focus:text-[#FFD600] transition-colors">Publications</Link>
                        </li>
                        <li>
                            <Link href="/events" className="hover:text-[#FFD600] focus:text-[#FFD600] transition-colors">Events</Link>
                        </li>
                    </ul>
                </nav>

                {/* Connect / Socials */}
                <div>
                    <span className="uppercase tracking-widest font-extrabold text-[#FFD600] mb-4 block text-base">Connect With Us</span>
                    <div className="flex gap-5 text-2xl mb-4">
                        <a
                            href="https://www.youtube.com/"
                            rel="noopener noreferrer"
                            target="_blank"
                            aria-label="YouTube"
                            className="hover:text-[#FFD600] focus:text-[#FFD600] transition-colors"
                        >
                            <FaYoutube />
                        </a>
                        <a
                            href="https://www.facebook.com/NAAPEHQ/"
                            rel="noopener noreferrer"
                            target="_blank"
                            aria-label="Facebook"
                            className="hover:text-[#FFD600] focus:text-[#FFD600] transition-colors"
                        >
                            <FaFacebookF />
                        </a>
                        <a
                            href="https://twitter.com/"
                            rel="noopener noreferrer"
                            target="_blank"
                            aria-label="Twitter"
                            className="hover:text-[#FFD600] focus:text-[#FFD600] transition-colors"
                        >
                            <FaTwitter />
                        </a>
                        {/*
                        <a
                            href="https://instagram.com"
                            rel="noopener noreferrer"
                            target="_blank"
                            aria-label="Instagram"
                            className="hover:text-[#FFD600] transition-colors"
                        >
                            <FaInstagram />
                        </a>
                        <a
                            href="https://linkedin.com"
                            rel="noopener noreferrer"
                            target="_blank"
                            aria-label="LinkedIn"
                            className="hover:text-[#FFD600] transition-colors"
                        >
                            <FaLinkedinIn />
                        </a>
                        */}
                    </div>
                    <Link
                        href="/register"
                        className="inline-block mt-2 px-6 py-2 rounded-md bg-[#FFD600] text-primary font-bold text-xs uppercase tracking-wider hover:bg-[#ffe066] focus:bg-[#ffe066] transition-colors outline-none"
                    >
                        Become a Member
                    </Link>
                </div>
            </div>

            <hr className="border-t-2 border-[#FFD600] opacity-70 mb-4" />

            {/* Bottom */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs md:text-sm font-medium tracking-tight text-[#DCE9FB]">
                <div className="text-center w-full md:w-auto">
                    &copy; {new Date().getFullYear()} <span className="font-semibold text-white">NAAPE</span>. All rights reserved.
                </div>
                <div className="w-full md:w-auto text-center">
                    Made with <span className="text-[#FFD600] font-bold" aria-hidden="true">&hearts;</span> for the Nigerian aviation community.
                </div>
            </div>
        </footer>
    );
}

