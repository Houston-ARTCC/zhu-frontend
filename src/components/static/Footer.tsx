import React from 'react';
import { LuPlane } from 'react-icons/lu';

export const Footer: React.FC = () => (
    <footer className="flex flex-col items-center bg-zinc-700 p-6 lg:py-10 dark:bg-zinc-950">
        <h6 className="mb-4 text-center font-medium text-white sm:mb-2 lg:text-xl">
            &copy; {new Date().getFullYear()}, Virtual Houston ARTCC.
            {' '}
            <br className="sm:hidden" />
            All Rights Reserved.
        </h6>
        <div className="flex flex-col items-center gap-3 text-slate-300 sm:flex-row">
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
            <a className="text-slate-300" href="https://discord.gg/CQFH72e4PR" target="_blank">
                Discord
            </a>
            <LuPlane className="rotate-45" />
            <a className="text-slate-300" href="https://github.com/Houston-ARTCC" target="_blank">
                GitHub
            </a>
        </div>
    </footer>
);
