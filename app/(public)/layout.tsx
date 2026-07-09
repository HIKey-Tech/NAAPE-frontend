import { Providers } from '@/context/provider/provider';
import { ReactNode } from 'react';
import PublicChrome from '@/components/ui/landing/home/public-chrome';

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <Providers>
            <PublicChrome>{children}</PublicChrome>
        </Providers>
    );
}
