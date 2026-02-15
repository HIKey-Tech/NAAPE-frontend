"use client";

import { AdminEventsLayout, EventSection } from "@/components/admin/events/AdminEventsLayout";
import PaymentOversightSection from "@/components/admin/events/PaymentOversightSection";
import { useState } from "react";

export default function EventPaymentsPage() {
    const [activeSection, setActiveSection] = useState<EventSection>(EventSection.PAYMENTS);

    return (
        <AdminEventsLayout 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
        >
            <PaymentOversightSection />
        </AdminEventsLayout>
    );
}