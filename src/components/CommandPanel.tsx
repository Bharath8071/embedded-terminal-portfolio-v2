interface CommandPanelProps {
  onCommand: (command: string) => void;
}

const COMMANDS_ROW1 = ['help', 'about', 'skills', 'projects'];
const COMMANDS_ROW2 = ['resume', 'github', 'linkedin', 'contact'];

const CommandPanel = ({ onCommand }: CommandPanelProps) => {
  return (
    <div className="shrink-0 bg-terminal-panel border-t border-border px-4 py-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {COMMANDS_ROW1.map((cmd) => (
          <button
            key={cmd}
            onClick={() => onCommand(cmd)}
            className="px-3 py-1.5 text-sm font-mono text-terminal-panel-text bg-background rounded border border-border hover:text-terminal-panel-hover hover:border-terminal-panel-hover transition-colors duration-150 cursor-pointer"
          >
            {cmd}
          </button>
        ))}
        {COMMANDS_ROW2.map((cmd) => (
          <button
            key={cmd}
            onClick={() => onCommand(cmd)}
            className="px-3 py-1.5 text-sm font-mono text-terminal-panel-text bg-background rounded border border-border hover:text-terminal-panel-hover hover:border-terminal-panel-hover transition-colors duration-150 cursor-pointer"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CommandPanel;
