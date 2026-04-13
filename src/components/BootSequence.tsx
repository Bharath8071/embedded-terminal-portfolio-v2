import { useState, useEffect } from 'react';
import { BOOT_MESSAGES } from '@/lib/commands';

interface BootSequenceProps {
  onComplete: () => void;
}

const BootSequence = ({ onComplete }: BootSequenceProps) => {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    if (currentLine >= BOOT_MESSAGES.length) {
      const timer = setTimeout(onComplete, 400);
      return () => clearTimeout(timer);
    }

    const delay = BOOT_MESSAGES[currentLine] === '' ? 200 : 300 + Math.random() * 200;
    const timer = setTimeout(() => {
      setLines(prev => [...prev, BOOT_MESSAGES[currentLine]]);
      setCurrentLine(prev => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentLine, onComplete]);

  return (
    <div className="p-2 sm:p-4 text-xs sm:text-sm">
      {lines.map((line, i) => (
        <div key={i} className="text-terminal-success terminal-glow">
          {line && '▸ '}{line}
        </div>
      ))}
      {currentLine < BOOT_MESSAGES.length && (
        <span className="inline-block w-1.5 h-3 sm:w-2 sm:h-4 bg-terminal-success cursor-blink" />
      )}
    </div>
  );
};

export default BootSequence;
