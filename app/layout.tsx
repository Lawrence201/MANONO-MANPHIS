import './globals.css';
import { Providers } from './providers';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Camp Elim Africa',
    description: 'Camp Elim Africa - Christian Retreat Center',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
