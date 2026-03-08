interface CommandPanelProps {
  onCommand: (command: string) => void;
}

const COMMANDS_ROW1 = ['help', 'about', 'skills', 'projects'];
const COMMANDS_ROW2 = ['resume', 'github', 'linkedin', 'contact'];

const CommandPanel = ({ onCommand }: CommandPanelProps) => {
  return (
    <div className="shrink-0 border-t border-border px-6 py-2 bg-background">
      <div className="flex justify-center gap-6 font-mono text-sm text-terminal-muted">
        {COMMANDS_ROW1.map((cmd) => (
          <span
            key={cmd}
            onClick={() => onCommand(cmd)}
            className="cursor-pointer hover:text-terminal-accent transition-colors duration-150"
          >
            {cmd}
          </span>
        ))}
      </div>
      <div className="flex justify-center gap-6 font-mono text-sm text-terminal-muted mt-1">
        {COMMANDS_ROW2.map((cmd) => (
          <span
            key={cmd}
            onClick={() => onCommand(cmd)}
            className="cursor-pointer hover:text-terminal-accent transition-colors duration-150"
          >
            {cmd}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CommandPanel;
