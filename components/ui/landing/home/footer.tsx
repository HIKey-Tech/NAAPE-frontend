
import Link from "next/link";
import Image from "next/image";
import { FaYoutube, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-primary text-white text-sm w-full mt-auto pt-12 pb-4 px-4 md:px-16 transition-all">
            {/* Top Section */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-16 mb-8 relative">
                <div className="flex flex-row items-center gap-4 mb-6 md:mb-0">
                    <Image
                        src="/logo.png"
                        alt="NAAPE Logo"
                        height={56}
                        width={56}
                        priority
                        className="h-14 w-14 bg-white rounded-lg shadow-md object-contain"
                    />
                    <span className="text-base font-semibold leading-tight text-white">
                        The National Association of<br className="hidden md:inline" />
                        Aircraft Pilots and Engineers
                    </span>
                </div>
                {/* Quick Links */}
                <div>
                    <span className="uppercase tracking-wider font-bold text-[#FFD600] mb-4 block text-sm">Quick Links</span>
                    <ul className="flex flex-col gap-2 text-[15px]">
                        <li>
                            <Link href="/" className="hover:text-[#FFD600] transition-colors">Home</Link>
                        </li>
                        <li>
                            <Link href="/about" className="hover:text-[#FFD600] transition-colors">About Us</Link>
                        </li>
                        <li>
                            <Link href="/news/naape" className="hover:text-[#FFD600] transition-colors">News</Link>
                        </li>
                        <li>
                            <Link href="/publications/naape" className="hover:text-[#FFD600] transition-colors">Publications</Link>
                        </li>
                        <li>
                            <Link href="/events" className="hover:text-[#FFD600] transition-colors">Events</Link>
                        </li>
                    </ul>
                </div>
                {/* Contact & Socials */}
                <div>
                    <span className="uppercase tracking-wider font-bold text-[#FFD600] mb-4 block text-sm">Connect With Us</span>
                    <div className="flex gap-4 text-xl mb-3">
                        <a
                            href="https://youtube.com"
                            rel="noopener noreferrer"
                            target="_blank"
                            aria-label="YouTube"
                            className="hover:text-[#FFD600] transition-colors"
                        >
                            <FaYoutube />
                        </a>
                        <a
                            href="https://facebook.com"
                            rel="noopener noreferrer"
                            target="_blank"
                            aria-label="Facebook"
                            className="hover:text-[#FFD600] transition-colors"
                        >
                            <FaFacebookF />
                        </a>
                        <a
                            href="https://twitter.com"
                            rel="noopener noreferrer"
                            target="_blank"
                            aria-label="Twitter"
                            className="hover:text-[#FFD600] transition-colors"
                        >
                            <FaTwitter />
                        </a>
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
                    </div>
                    <Link
                        href="/membership"
                        className="inline-block mt-2 px-5 py-2 rounded-md bg-[#FFD600] text-primary font-semibold text-xs uppercase shadow hover:bg-yellow-300 transition-colors"
                    >
                        Become a Member
                    </Link>
                </div>
            </div>

            <hr className="border-[#7EA8EF] mb-4" />

            {/* Bottom */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs tracking-tight text-[#B9CBEC] gap-2">
                <div className="text-center w-full md:w-auto">
                    &copy; {new Date().getFullYear()} NAAPE. All rights reserved.
                </div>
                <div className="w-full md:w-auto text-center">
                    Made with <span className="text-[#FFD600]">&hearts;</span> for the Nigerian aviation community.
                </div>
            </div>
        </footer>
    );
}

