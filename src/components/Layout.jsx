import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Moon, Sun } from 'lucide-react';

const Layout = ({ children }) => {
    const [theme, setTheme] = React.useState(() => localStorage.getItem('theme') || 'light');

    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    return (
        <div className="min-h-screen flex flex-col bg-background text-text-main relative selection:bg-emerald-500/20 transition-colors duration-500">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-stone-200/40 dark:bg-stone-800/20 rounded-full blur-[120px] opacity-60 transition-colors duration-700" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-[100px] opacity-40 transition-colors duration-700" />
            </div>

            <Header theme={theme} onToggleTheme={toggleTheme} />

            <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 relative z-10 w-full max-w-7xl mx-auto">
                {children}
            </main>

            <Footer />
        </div>
    );
};

export default Layout;
