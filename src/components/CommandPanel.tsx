interface CommandPanelProps {
  onCommand: (command: string) => void;
}

const COMMANDS_ROW1 = ['all', 'about', 'skills', 'projects', 'experience', 'certs'];
const COMMANDS_ROW2 = ['contact', 'github', 'linkedin', 'resume', 'neofetch', 'help'];

const CommandPanel = ({ onCommand }: CommandPanelProps) => {
  return (
    <div className="shrink-0 border-t border-border px-6 py-3 bg-background">
      <p className="text-center text-xs text-muted-foreground/50 italic mb-2">
        Tip: click a command below or type it manually
      </p>
      <div className="grid grid-cols-6 gap-y-1 font-mono text-sm text-muted-foreground">
        {[...COMMANDS_ROW1, ...COMMANDS_ROW2].map((cmd) => (
          <span
            key={cmd}
            onClick={() => onCommand(cmd)}
            className="text-center cursor-pointer hover:text-primary transition-colors duration-150"
          >
            {cmd}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CommandPanel;
