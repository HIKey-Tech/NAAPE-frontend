import CredibilitySection from "@/components/ui/landing/about/credibility";
import MembershipHeroSection from "@/components/ui/landing/membership/hero";
import OurMembersSection from "@/components/ui/landing/membership/our.members";
import ReadySection from "@/components/ui/landing/membership/ready";
import WhyJoinSection from "@/components/ui/landing/membership/why.join";


export default function MembershipPage() {
    return (
        <>
            <MembershipHeroSection />
            <WhyJoinSection />
            <ReadySection />
            <OurMembersSection />
            <CredibilitySection/>
        </>


    );
}
