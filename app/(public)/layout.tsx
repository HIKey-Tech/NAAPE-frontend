import Footer from '@/components/ui/landing/home/footer';
import TopNavbar from '@/components/ui/landing/home/navbar';
import { Providers } from '@/context/provider/provider';
import { ReactNode } from 'react';
import WhatsAppFloat from '@/components/ui/custom/whatsapp';

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Providers>
                <main>
                    <TopNavbar />
                    {children}
                    <Footer />
                </main>
                <WhatsAppFloat />
            </Providers>
        </>
    );
}
