import BirthSection from "@/components/ui/landing/about/birth";
import CredibilitySection from "@/components/ui/landing/about/credibility";
import FutureSection from "@/components/ui/landing/about/future";
import AboutHeroSection from "@/components/ui/landing/about/hero";
import LeadershipTimelineSection from "@/components/ui/landing/about/leaders";
import MissionSection from "@/components/ui/landing/about/mission";
import OriginSection from "@/components/ui/landing/about/origin";
import WhatWeDoSection from "@/components/ui/landing/about/what.we.do";



export default function AboutPage() {
    return (
        <>
            <AboutHeroSection />
            <BirthSection />
            <OriginSection />
            <FutureSection />
            <MissionSection />
            <LeadershipTimelineSection />
            <WhatWeDoSection />
            <CredibilitySection />
        </>

    );
}
