
import Link from "next/link";
import Image from "next/image";
import { FaYoutube, FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-[#1a1f36] text-white text-sm w-full mt-auto pt-16 pb-6 px-6 md:px-12 transition-all border-t border-slate-800">
            {/* Top Section */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-12 md:gap-24 mb-16 relative">

                {/* Brand + Title */}
                <div className="flex flex-row items-center gap-4 mb-7 md:mb-0">
                    <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                        <Image
                            src="/logo.png"
                            alt="NAAPE Logo"
                            height={48}
                            width={48}
                            className="h-12 w-12 object-contain brightness-0 invert opacity-90"
                        />
                    </div>
                    <span className="text-xl font-bold leading-tight text-white tracking-tight">
                        <span className="block text-accent">National Association of</span>
                        <span className="block font-black">Aircraft Pilots & Engineers</span>
                    </span>
                </div>

                {/* Quick Links */}
                <nav aria-label="Footer Quick Links">
                    <span className="text-sm uppercase tracking-widest font-bold text-accent mb-6 block opacity-90">Quick Links</span>
                    <ul className="flex flex-col gap-3 text-sm text-gray-300 font-medium">
                        <li><Link href="/" className="hover:text-accent transition-colors duration-200">Home</Link></li>
                        <li><Link href="/about/about-us" className="hover:text-accent transition-colors duration-200">About Us</Link></li>
                        <li><Link href="/news/naape" className="hover:text-accent transition-colors duration-200">News</Link></li>
                        <li><Link href="/publication" className="hover:text-accent transition-colors duration-200">Publications</Link></li>
                        <li><Link href="/events" className="hover:text-accent transition-colors duration-200">Events</Link></li>
                    </ul>
                </nav>

                {/* Connect / Socials */}
                <div>
                    <span className="text-sm uppercase tracking-widest font-bold text-accent mb-6 block opacity-90">Connect</span>
                    <div className="flex gap-4 mb-6">
                        {[FaYoutube, FaFacebookF, FaTwitter, FaLinkedinIn].map((Icon, i) => (
                            <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent hover:text-primary flex items-center justify-center transition-all duration-300">
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium tracking-wide">
                <div>&copy; {new Date().getFullYear()} NAAPE. All rights reserved.</div>
                <div className="flex gap-6">
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
                </div>
            </div>
        </footer>
    );
}
