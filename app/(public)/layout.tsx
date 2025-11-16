// app/(auth)/layout.tsx
import Footer from '@/components/ui/landing/home/footer';
import TopNavbar from '@/components/ui/landing/home/navbar';
import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (


        <main>
            <TopNavbar />
            {children}
            <Footer />
        </main>

    );
}
