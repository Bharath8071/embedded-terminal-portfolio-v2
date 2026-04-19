import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

interface WelcomeDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

/**
 * WelcomeDialog Component
 *
 * Shows a one-time welcome dialog when users first visit the site.
 * Uses localStorage to track if the user has seen the dialog.
 * Displays after BootSequence completes for a polished OS-like experience.
 *
 * Key Features:
 * - Controlled component (receives isOpen/setIsOpen from parent)
 * - Mounted state prevents hydration issues in SSR/Next.js
 * - localStorage persistence across sessions
 * - Terminal-themed styling with green accent colors
 * - Proper z-index to appear above full-screen terminal
 * - Accessible close button
 * - Shows only if localStorage key 'hasSeenWelcome' is not set
 */
const WelcomeDialog = ({ isOpen, setIsOpen }: WelcomeDialogProps) => {
  const [mounted, setMounted] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  useEffect(() => {
    // Only run on client-side to avoid hydration mismatch
    setMounted(true);
    // Check if user has already seen the dialog
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (hasSeenWelcome) {
      setIsOpen(false);
    }
  }, [setIsOpen]);

  // Handle Enter key to close dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Prevent rendering until mounted to avoid hydration issues
  if (!mounted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        className="sm:max-w-[520px] z-[99999] bg-[#0b0f14] border border-slate-700/50 text-slate-200 shadow-xl shadow-black/80 font-mono p-0 gap-0"
        onCloseAutoFocus={(e) => {
          e.preventDefault(); // Stop default focus behavior
          document.getElementById('terminal-input')?.focus(); // Focus terminal input
        }}
      >
        {/* Terminal Window Header (macOS style) */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 bg-slate-900/30">
          <div className="flex items-center gap-2">
            {/* Window control buttons */}
            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition" />
            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition" />
            <span className="text-slate-400 text-xs ml-3">
              bharath@portfolio ~ %
            </span>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="px-4 py-4 space-y-3 text-sm leading-relaxed">
          {/* Welcome command */}
          <div>
            <p className="text-green-400">
              <span className="text-green-500">$</span> welcome
            </p>
          </div>

          {/* Command suggestions */}
          <div className="text-terminal-muted text-sm space-y-2">
            <p>Hello, I'm Bharath 👋</p>
            <p>Welcome to my interactive terminal portfolio.</p>
            
            <p className="mt-3">You can explore using commands like:</p>
            
            <p>
              <span className="text-terminal-success">$</span>{" "}
              <span className="text-terminal-accent">about</span>
            </p>
            <p>
              <span className="text-terminal-success">$</span>{" "}
              <span className="text-terminal-accent">projects</span>
            </p>
            <p>
              <span className="text-terminal-success">$</span>{" "}
              <span className="text-terminal-accent">skills</span>
            </p>
            <p>
              or you can use <span className="text-terminal-success">$</span>{" "} <span className="text-terminal-accent">all-info</span> to see all about me
            </p>
            <p className="mt-3 text-xs text-terminal-muted/70">
              Tip: Press <span className="text-terminal-accent">TAB</span> for autocomplete and{" "}
              <span className="text-terminal-accent">ENTER</span> to execute commands.
            </p>
          </div>

          {/* Tips */}
          {/* <div className="mt-4 text-xs text-slate-500">
            <p>💡 Tip: Press <span className="text-slate-400">TAB</span> for autocomplete</p>
          </div> */}
        </div>

        {/* Close action (terminal style) */}
        <div className="px-4 py-3 border-t border-slate-700/50 bg-slate-900/20">
          <button
            onClick={handleClose}
            className="text-green-400 hover:text-green-300 text-xs font-mono transition"
          >
            press enter to continue... →
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog;