interface CommandPanelProps {
  onCommand: (command: string) => void;
}

const COMMANDS_ROW1 = ['all', 'about', 'skills', 'projects', 'experience', 'certs'];
const COMMANDS_ROW2 = ['contact', 'github', 'linkedin', 'resume', 'neofetch', 'help'];

const CommandPanel = ({ onCommand }: CommandPanelProps) => {
  return (
    <div className="shrink-0 border-t border-border px-6 py-2 bg-background">
      {[COMMANDS_ROW1, COMMANDS_ROW2].map((row, ri) => (
        <div key={ri} className="flex justify-between font-mono text-sm text-terminal-muted">
          {row.map((cmd) => (
            <span
              key={cmd}
              onClick={() => onCommand(cmd)}
              className="cursor-pointer hover:text-terminal-accent transition-colors duration-150"
            >
              {cmd}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CommandPanel;
