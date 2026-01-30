import React from 'react';
import { ScanFace, Sun, Moon } from 'lucide-react';

const Header = ({ theme, onToggleTheme }) => {
    return (
        <header className="w-full p-6 flex justify-between items-center z-50 relative">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-surface rounded-2xl border border-border-subtle shadow-sm transition-colors duration-500">
                    <ScanFace className="text-text-main w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-text-main transition-colors duration-500">Emotion AI</h1>
                    <p className="text-xs text-text-muted font-medium transition-colors duration-500">Kindness in every detection</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleTheme}
                    className="p-3 bg-surface border border-border-subtle rounded-2xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-all duration-300 shadow-sm text-text-main"
                    aria-label="Toggle Theme"
                >
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>

                <button
                    className="hidden md:block px-6 py-2.5 text-sm font-semibold text-text-muted hover:text-text-main bg-surface border border-border-subtle rounded-xl transition-all duration-300 hover:shadow-sm"
                    onClick={() => window.open('https://developers.google.com/mediapipe/solutions/vision/face_landmarker', '_blank')}
                >
                    Learn More
                </button>
            </div>
        </header>
    );
};

export default Header;
