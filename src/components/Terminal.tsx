import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BootSequence from './BootSequence';
import Neofetch from './Neofetch';
import { executeCommand } from '@/lib/commands';

interface TerminalEntry {
  id: number;
  command?: string;
  output?: string[];
  isNeofetch?: boolean;
}

const HINTS = [
  'Tip: type "help" to see commands',
  'Tip: try "projects"',
  'Tip: press ↑ for command history',
  'Tip: type "neofetch"',
  'Tip: type "about" to learn more',
  'Tip: try "skills"',
];

const Terminal = () => {
  const [phase, setPhase] = useState<'boot' | 'ready'>('boot');
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [hintIndex, setHintIndex] = useState(0);
  const [entryCounter, setEntryCounter] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Rotate hints
  useEffect(() => {
    const interval = setInterval(() => {
      setHintIndex(prev => (prev + 1) % HINTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries, phase]);

  // Focus input
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleBootComplete = useCallback(() => {
    setEntries([{ id: 0, isNeofetch: true }]);
    setEntryCounter(1);
    setPhase('ready');
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    const result = executeCommand(trimmed);

    if (result.type === 'clear') {
      setEntries([]);
      setInput('');
      setHistoryIndex(-1);
      if (trimmed) setHistory(prev => [...prev, trimmed]);
      return;
    }

    const newEntry: TerminalEntry = {
      id: entryCounter,
      command: input,
      output: result.type === 'neofetch' ? undefined : result.content,
      isNeofetch: result.type === 'neofetch',
    };

    setEntries(prev => [...prev, newEntry]);
    setEntryCounter(prev => prev + 1);
    setInput('');
    setHistoryIndex(-1);
    if (trimmed) setHistory(prev => [...prev, trimmed]);
  }, [input, entryCounter]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(history[newIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= history.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    }
  }, [handleSubmit, history, historyIndex]);

  return (
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden scanline relative">
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-terminal-header border-b border-border shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-terminal-muted text-sm ml-2">bharath@portfolio:~</span>
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 cursor-text"
        onClick={focusInput}
      >
        {phase === 'boot' && <BootSequence onComplete={handleBootComplete} />}

        {phase === 'ready' && (
          <div className="text-sm">
            {entries.map((entry) => (
              <div key={entry.id} className="mb-2">
                {entry.command !== undefined && (
                  <div>
                    <span className="text-terminal-success font-semibold">bharath@portfolio</span>
                    <span className="text-terminal-muted">:</span>
                    <span className="text-terminal-accent font-semibold">~</span>
                    <span className="text-foreground">$ </span>
                    <span className="text-foreground">{entry.command}</span>
                  </div>
                )}
                {entry.isNeofetch && <Neofetch />}
                {entry.output && entry.output.map((line, i) => (
                  <div key={i} className="text-foreground whitespace-pre">{line}</div>
                ))}
              </div>
            ))}

            {/* Input line */}
            <div className="flex items-center">
              <span className="text-terminal-success font-semibold">bharath@portfolio</span>
              <span className="text-terminal-muted">:</span>
              <span className="text-terminal-accent font-semibold">~</span>
              <span className="text-foreground">$ </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-foreground caret-terminal-success ml-1"
                autoFocus
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
              />
            </div>

            {/* Rotating hint */}
            <div className="mt-4 h-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={hintIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 0.5, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs text-terminal-muted italic"
                >
                  {HINTS[hintIndex]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
