import Footer from '@/components/ui/landing/home/footer';
import TopNavbar from '@/components/ui/landing/home/navbar';
import { Providers } from '@/context/provider/provider';
import { ReactNode } from 'react';

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (

        <>
            <Providers>
                
            <main>
                <TopNavbar />
                {children}
                <Footer />
            </main>
</Providers>
        </>

    );
}
