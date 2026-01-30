import React from 'react';
import { Github, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full p-4 flex justify-between items-center bg-surface border-t border-border-subtle text-text-muted text-sm transition-all duration-500">
            <p>© 2026 Sentience Systems. All rights reserved.</p>
            <div className="flex gap-4">
                <a href="https://github.com/ashish-ai-build" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">
                    <Github className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/in/ashish-choudhary-b63b65328/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">
                    <Linkedin className="w-5 h-5" />
                </a>
            </div>
        </footer>
    );
};

export default Footer;
