import React from 'react';
import { LuPlane } from 'react-icons/lu';

export const Footer: React.FC = () => (
    <footer className="flex flex-col items-center bg-gray-700 py-14">
        <h6 className="mb-2 text-xl font-medium text-white">
            &copy; {new Date().getFullYear()}, Virtual Houston ARTCC. All Rights Reserved.
        </h6>
        <div className="flex items-center gap-3 text-slate-300">
            <a className="text-slate-300" href="https://vatsim.net/" target="_blank">
                VATSIM
            </a>
            <LuPlane className="rotate-45" />
            <a className="text-slate-300" href="https://vatusa.net/" target="_blank">
                VATUSA
            </a>
            <LuPlane className="rotate-45" />
            <a className="text-slate-300" href="/privacy" target="_blank">
                Privacy Policy
            </a>
            <LuPlane className="rotate-45" />
            <a className="text-slate-300" href="/feedback" target="_blank">
                Feedback
            </a>
            <LuPlane className="rotate-45" />
            <a className="text-slate-300" href="https://discord.gg/Ag2cdZz" target="_blank">
                Discord
            </a>
            <LuPlane className="rotate-45" />
            <a className="text-slate-300" href="https://github.com/Houston-ARTCC" target="_blank">
                GitHub
            </a>
        </div>
    </footer>
);
