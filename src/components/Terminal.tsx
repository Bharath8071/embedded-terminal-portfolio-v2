import { useState, useRef, useEffect, useCallback, KeyboardEvent, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BootSequence from './BootSequence';
import Neofetch from './Neofetch';
import CommandPanel from './CommandPanel';
import { executeCommand, AVAILABLE_COMMANDS } from '@/lib/commands';

interface TerminalEntry {
  id: number;
  command?: string;
  output?: string[];
  isNeofetch?: boolean;
}

// const MARKDOWN_LINK = /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g;
const MARKDOWN_LINK = /\[([^\]]+)\]\(((https?:\/\/|mailto:)[^\s]+)\)/g;

const URL_PATTERN = /(https?:\/\/[^\s]+|(?:github|linkedin)\.com\/[^\s]+)/g;

const toHref = (text: string) => (text.startsWith('http') ? text : `https://${text}`);

const HINTS = [
  'Tip: click a command below or type it manually',
  'Tip: press TAB to autocomplete',
];

const Terminal = () => {
  const [phase, setPhase] = useState<'boot' | 'ready'>('boot');
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [hintIndex, setHintIndex] = useState(0);
  const [entryCounter, setEntryCounter] = useState(0);
  const [showInput, setShowInput] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Rotate hints
  useEffect(() => {
    const interval = setInterval(() => {
      setHintIndex(prev => (prev + 1) % HINTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries, phase, showInput]);

  // Focus input
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleBootComplete = useCallback(() => {
    setEntries([{ id: 0, isNeofetch: true }]);
    setEntryCounter(1);
    setPhase('ready');
  }, []);

  // const runCommand = useCallback((cmd: string) => {
  //   const result = executeCommand(cmd);

  //   if (result.type === 'clear') {
  //     setEntries([]);
  //     setInput('');
  //     setHistoryIndex(-1);
  //     if (cmd) setHistory(prev => [...prev, cmd]);
  //     return;
  //   }
  const runCommand = useCallback((cmd: string) => {
    const result = executeCommand(cmd);
  
    if (result.type === 'clear') {
      setEntries([]);
      setInput('');
      setHistoryIndex(-1);
      if (cmd) setHistory(prev => [...prev, cmd]);
      return;
    }
  
    const newEntry: TerminalEntry = {
      id: entryCounter,
      command: cmd,
      output: result.type === 'neofetch' ? undefined : result.content,
      isNeofetch: result.type === 'neofetch',
    };
  
    setEntries(prev => [...prev, newEntry]);
    setEntryCounter(prev => prev + 1);
    setInput('');
    setHistoryIndex(-1);
    if (cmd) setHistory(prev => [...prev, cmd]);
  
    // 🔥 ADD THIS PART
    setShowInput(false);
  
    setTimeout(() => {
      setShowInput(true);
    }, 400);
  }, [entryCounter]);

  const handleSubmit = useCallback(() => {
    runCommand(input.trim());
  }, [input, runCommand]);

  const handlePanelCommand = useCallback((cmd: string) => {
    runCommand(cmd);
    inputRef.current?.focus();
  }, [runCommand]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const partial = input.trim().toLowerCase();
      if (!partial) return;
      const matches = AVAILABLE_COMMANDS.filter(c => c.startsWith(partial));
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        // Find common prefix
        let prefix = matches[0];
        for (const m of matches) {
          while (!m.startsWith(prefix)) {
            prefix = prefix.slice(0, -1);
          }
        }
        if (prefix.length > partial.length) {
          setInput(prefix);
        }
      }
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
  }, [handleSubmit, history, historyIndex, input]);

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
        // className="flex-1 overflow-y-auto p-4 cursor-text flex flex-col justify-end"
        onClick={focusInput}
      >
        {phase === 'boot' && <BootSequence onComplete={handleBootComplete} />}

        {phase === 'ready' && (
          <div className="text-base">
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
                {entry.output && entry.output.map((line, i) => {
                  // 1) Markdown-style links: [label](https://example.com)
                  const mdMatches = [...line.matchAll(MARKDOWN_LINK)];
                  if (mdMatches.length > 0) {
                    const parts: ReactNode[] = [];
                    let last = 0;

                    mdMatches.forEach((match, idx) => {
                      const full = match[0];
                      const label = match[1];
                      const url = match[2];
                      const start = match.index ?? 0;

                      if (start > last) {
                        parts.push(
                          <span key={`l${i}-md-t-${idx}`}>
                            {line.slice(last, start)}
                          </span>
                        );
                      }

                      parts.push(
                        <a
                          key={`l${i}-md-l-${idx}`}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-terminal-accent underline hover:text-terminal-success cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {label}
                        </a>
                      );

                      last = start + full.length;
                    });

                    if (last < line.length) {
                      parts.push(
                        <span key={`l${i}-md-tail`}>
                          {line.slice(last)}
                        </span>
                      );
                    }

                    return (
                      <div key={i} className="text-foreground whitespace-pre">
                        {parts}
                      </div>
                    );
                  }

                  // 2) Fallback: auto-detect raw URLs (existing behavior)
                  const matches = [...line.matchAll(URL_PATTERN)];
                  if (matches.length === 0) {
                    return <div key={i} className="text-foreground whitespace-pre">{line}</div>;
                  }

                  const parts: ReactNode[] = [];
                  let last = 0;

                  matches.forEach((match, idx) => {
                    const text = match[0];
                    const start = match.index ?? 0;

                    if (start > last) {
                      parts.push(
                        <span key={`l${i}-t-${idx}`}>
                          {line.slice(last, start)}
                        </span>
                      );
                    }

                    parts.push(
                      <a
                        key={`l${i}-l-${idx}`}
                        href={toHref(text)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-terminal-accent underline decoration-dotted hover:text-terminal-success"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {text}
                      </a>
                    );

                    last = start + text.length;
                  });

                  if (last < line.length) {
                    parts.push(
                      <span key={`l${i}-tail`}>
                        {line.slice(last)}
                      </span>
                    );
                  }

                  return (
                    <div key={i} className="text-foreground whitespace-pre">
                      {parts}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Input line */}
            {showInput && (
              <div className="flex items-center">

                <span className="text-terminal-success font-semibold">bharath@kernel-dev</span>
                <span className="text-terminal-muted">:</span>
                <span className="text-terminal-accent font-semibold">~</span>
                <span className="text-foreground">$ </span>
                <div className="relative flex-1 ml-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent outline-none text-foreground caret-transparent"
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                    autoCapitalize="off"
                  />
                  {/* Block cursor overlay */}
                  <span
                    className="absolute top-0 left-0 pointer-events-none text-foreground whitespace-pre"
                    aria-hidden="true"
                  >
                    {input}
                    <span className="inline-block w-[0.6em] h-[1.2em] bg-terminal-success/80 cursor-blink align-middle -mb-[0.1em]" />
                  </span>
                </div>
              </div>
            )}

            {/* Rotating hint */}
            {showInput && (
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
            )
          } 
          </div>
        )}
      </div>

      {phase === 'ready' && <CommandPanel onCommand={handlePanelCommand} />}
    </div>
  );
};

export default Terminal;
