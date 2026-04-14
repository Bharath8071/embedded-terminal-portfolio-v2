import { useState, useRef, useEffect, useMemo, useCallback, KeyboardEvent, ReactNode } from 'react';
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

const GHOST_ROTATE_MS = 1000;

const HINTS = [
  'Tip: press TAB to autocomplete',
  // 'Tip: press TAB to autocomplete',
  // 'Tip: click a command below or type it manually',
];

// Predefined ordered flow of commands for guided experience
const FLOW_COMMANDS = [
  'about', 'projects', 'project 1', 'project 2', 'project 3', 'project 4', 'skills',
  'experience', 'certs', 'contact', 'resume'
];

const renderLine = (line: string, i: number) => {
  const regex = /\*\*(.+?)\*\*|\#\#(.+?)\#\#|\+\+(.+?)\+\+/g;
  const parts: ReactNode[] = [];
  let last = 0;
  let match;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > last) {
      parts.push(<span key={`${i}-t-${last}`}>{line.slice(last, match.index)}</span>);
    }

    let text: string;
    let className: string;

    if (match[1]) {
      text = match[1];
      className = "text-[16px] text-terminal-accent-200";  // ** = blue
    } else if (match[2]) {
      text = match[2];
      className = "text-gray-500";                      // ## = gray
    } else {
      text = match[3];
      className = "text-terminal-success";              // ++ = green
    }

    parts.push(
      <span key={`${i}-b-${match.index}`} className={className}>
        {text}
      </span>
    );

    last = match.index + match[0].length;
  }

  if (last < line.length) {
    parts.push(<span key={`${i}-tail`}>{line.slice(last)}</span>);
  }

  return (
    <div key={i} className="text-foreground whitespace-pre-wrap break-words">
      {parts.length > 0 ? parts : line}
    </div>
  );
};

const Terminal = () => {
  const [phase, setPhase] = useState<'boot' | 'ready'>('boot');
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [input, setInput] = useState('');
  const [baseInput, setBaseInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [hintIndex, setHintIndex] = useState(0);
  const [entryCounter, setEntryCounter] = useState(0);
  const [showInput, setShowInput] = useState(true);
  const [matches, setMatches] = useState<string[]>([]);
  const [suggestIndex, setSuggestIndex] = useState(0);

  // Flow suggestion state
  const [lastCmd, setLastCmd] = useState('');
  const [lastExecutedCommand, setLastExecutedCommand] = useState<string>('');
  const [currentFlowIndex, setCurrentFlowIndex] = useState(0);
  const [isFlowActive, setIsFlowActive] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ghostSuffix = useMemo(() => {
    if (matches.length === 0) return '';
    const candidate = matches[suggestIndex % matches.length];
    const base = baseInput.trim().toLowerCase();
    if (!base || !candidate.startsWith(base)) return '';
    return candidate.slice(base.length);
  }, [matches, suggestIndex, baseInput]);

  // Get the current flow suggestion
  const flowSuggestion = useMemo(() => {
    if (!isFlowActive || currentFlowIndex >= FLOW_COMMANDS.length) return '';
    return FLOW_COMMANDS[currentFlowIndex];
  }, [isFlowActive, currentFlowIndex]);

  // Get the flow ghost suffix (remaining part after current input)
  const flowGhostSuffix = useMemo(() => {
    if (!flowSuggestion) return '';
    const base = baseInput.trim().toLowerCase();
    const suggestionLower = flowSuggestion.toLowerCase();
    
    // If input is empty, show the full suggestion
    if (!base) return flowSuggestion;
    
    // If input matches the start of suggestion, show remaining part
    if (suggestionLower.startsWith(base)) {
      return flowSuggestion.slice(base.length);
    }
    
    // If input doesn't match, don't show flow suggestion
    return '';
  }, [flowSuggestion, baseInput]);

  useEffect(() => {
    const normalizedBaseInput = baseInput.trim().toLowerCase();
    if (!normalizedBaseInput) {
      setMatches([]);
    } else {
      setMatches(AVAILABLE_COMMANDS.filter((command) => command.startsWith(normalizedBaseInput)));
    }
    setSuggestIndex(0);
  }, [baseInput]);

  // Auto-rotate ghost through prefix matches every 2s (loops)
  // useEffect(() => {
  //   if (matches.length === 0) return;
  //   const id = window.setInterval(() => {
  //     setSuggestIndex((prev) => (prev + 1) % matches.length);
  //   }, GHOST_ROTATE_MS);
  //   return () => window.clearInterval(id);
  // }, [matches]);

  // Rotate hints
  useEffect(() => {
    const interval = setInterval(() => {
      setHintIndex(prev => (prev + 1) % HINTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  // useEffect(() => {
  //   if (scrollRef.current) {
  //     scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  //   }
  // }, [entries, phase, showInput]);

  useEffect(() => {
  if (!scrollRef.current) return;

  if (lastCmd === 'all-info') return; // 🚫 disable scroll

  scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [entries, phase, showInput, lastCmd]);

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
    setLastCmd(cmd.trim().toLowerCase());
  
    if (result.type === 'clear') {
        setEntries([]);
        setInput('');
        setBaseInput('');
        setHistoryIndex(-1);
        setMatches([]);
        setSuggestIndex(0);
        setIsFlowActive(false);
        setCurrentFlowIndex(0); // or -1 (better)
        // setProjectGhostActive(false);
        // setProjectGhostSeq(1);

        if (result.next === 'neofetch') {
          setEntries([{ id: 0, isNeofetch: true }]);
          setEntryCounter(1);
        }
      
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
    setBaseInput('');
    setMatches([]);
    setSuggestIndex(0);
    setHistoryIndex(-1);
    if (cmd) setHistory(prev => [...prev, cmd]);
  
    // Update flow state
    const normalizedCmd = cmd.trim().toLowerCase();
    setLastExecutedCommand(normalizedCmd);
    
    // Check if command matches expected next in flow
    if (isFlowActive && currentFlowIndex < FLOW_COMMANDS.length) {
      const expectedNext = FLOW_COMMANDS[currentFlowIndex].toLowerCase();
      if (normalizedCmd === expectedNext) {
        // Advance flow
        setCurrentFlowIndex(prev => prev + 1);
      } else {
        // Break flow if command doesn't match expected next
        setIsFlowActive(false);
      }
    } else if (normalizedCmd === 'about' && !isFlowActive) {
      // Restart flow if 'about' is executed when flow is broken
      setIsFlowActive(true);
      setCurrentFlowIndex(1); // Set to 1 since 'about' was just executed
    }

    // Note: you could also consider allowing certain "non-breaking" commands that don't affect flow progression, depending on your desired UX. For simplicity, any unexpected command breaks the flow in this implementation.
    // setShowInput(false);
  
    if (cmd.trim().toLowerCase() !== 'all-info') {
      setShowInput(false);
    
      setTimeout(() => {
        setShowInput(true);
      }, 100);
    }
    
  }, [entryCounter, isFlowActive, currentFlowIndex]);

  const getSelectedSuggestion = useCallback(() => {
    // Prioritize flow suggestion if available
    if (flowSuggestion) {
      const base = baseInput.trim().toLowerCase();
      if (!base || flowSuggestion.toLowerCase().startsWith(base)) {
        return flowSuggestion;
      }
    }
    
    // Fall back to generic autocomplete
    if (matches.length === 0) return '';
    return matches[suggestIndex % matches.length];
  }, [matches, suggestIndex, flowSuggestion, baseInput]);

  const handleSubmit = useCallback(() => {
    const selectedSuggestion = getSelectedSuggestion();
    runCommand((selectedSuggestion || input).trim());
  }, [getSelectedSuggestion, input, runCommand]);

  const handlePanelCommand = useCallback((cmd: string) => {
    runCommand(cmd);
    inputRef.current?.focus();
  }, [runCommand]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const chosen = getSelectedSuggestion();
      if (!chosen) return;
      setInput(chosen);
      setBaseInput(chosen);
    } else if (e.key === 'ArrowRight') {
      const chosen = getSelectedSuggestion();
      if (!chosen) return;
      e.preventDefault();
      setInput(chosen);
      setBaseInput(chosen);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      const historyValue = history[newIndex];
      setInput(historyValue);
      setBaseInput(historyValue);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= history.length) {
        setHistoryIndex(-1);
        setInput('');
        setBaseInput('');
      } else {
        setHistoryIndex(newIndex);
        const historyValue = history[newIndex];
        setInput(historyValue);
        setBaseInput(historyValue);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    }
  }, [getSelectedSuggestion, handleSubmit, history, historyIndex]);

  return (
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden scanline relative text-sm sm:text-base">
      {/* Terminal header */}
      <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-terminal-header border-b border-border shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-terminal-muted text-xs sm:text-sm ml-1.5 sm:ml-2">bharath@portfolio:~</span>
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-2 sm:p-4 cursor-text"
        // className="flex-1 overflow-y-auto p-4 cursor-text flex flex-col justify-end"
        onClick={focusInput}
      >
        {phase === 'boot' && <BootSequence onComplete={handleBootComplete} />}

        {phase === 'ready' && (
          <div className="text-sm sm:text-base">
            {entries.map((entry) => (
              <div key={entry.id} className="mb-1.5 sm:mb-2">
                {entry.command !== undefined && (
                  <div>
                    <span className="text-terminal-success font-semibold">bharath@embedded-dev</span>
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
                          <span key={`l${i}-md-t-${idx}`}className="whitespace-pre-wrap">
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
                          className="text-terminal-accent underline hover:text-terminal-success cursor-pointer whitespace-pre-wrap"
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
                      <div key={i} className="text-foreground whitespace-pre-wrap break-words">
                        {parts}
                      </div>
                    );
                  }

                  // 2) Fallback: auto-detect raw URLs (existing behavior)
                  const matches = [...line.matchAll(URL_PATTERN)];
                  if (matches.length === 0 ) {
                    return renderLine(line, i);
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
                    <div key={i} className="text-foreground whitespace-pre-wrap break-words">
                      {parts}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Input line */}
            {showInput && (
              <div className="flex items-center text-sm sm:text-base">

                <span className="text-terminal-success font-semibold">bharath@embedded-dev</span>
                <span className="text-terminal-muted">:</span>
                <span className="text-terminal-accent font-semibold">~</span>
                <span className="text-foreground">$ </span>
                <div className="relative flex-1 ml-1 min-w-0">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => {
                      const nextValue = e.target.value;
                      setInput(nextValue);
                      setBaseInput(nextValue);
                    }}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent outline-none text-foreground caret-transparent text-sm sm:text-base"
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                    autoCapitalize="off"
                  />
                  {/* Block cursor overlay */}
                  <span
                    className="absolute top-0 left-0 pointer-events-none whitespace-pre-wrap break-words"
                    aria-hidden="true"
                  >
                    <span className="text-foreground">{input}</span>
                    <span className="inline-block w-[0.6em] h-[1.2em] bg-terminal-success/80 cursor-blink align-middle -mb-[0.1em] text-foreground" />
                    {flowGhostSuffix ? (
                      <span className="text-muted-foreground/80 select-none">{flowGhostSuffix}</span>
                    ) : ghostSuffix ? (
                      <span className="text-muted-foreground/80 select-none">{ghostSuffix}</span>
                    ) : null}
                  </span>
                </div>
              </div>
            )}

            {/* Rotating hint */}
            {showInput && (
              <div className="mt-2 sm:mt-1 h-3 sm:h-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={hintIndex}
                    initial={{ opacity: 0, y: 5 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[11px] sm:text-[13px] text-terminal-muted/100 italic"
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
