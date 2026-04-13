interface CommandPanelProps {
  onCommand: (command: string) => void;
}

const COMMANDS_ROW1 = ['all', 'about', 'skills', 'projects', 'experience', 'certs'];
const COMMANDS_ROW2 = ['contact', 'github', 'linkedin', 'resume', 'neofetch', 'help'];

const CommandPanel = ({ onCommand }: CommandPanelProps) => {
  return (
    // <div className="shrink-0 border-t border-border px-3 sm:px-6 py-2 sm:py-3 bg-background">
    <div className="shrink-0 border-t border-border px-2 sm:px-4 py-1.5 sm:py-2 bg-background">
      <p className="text-center text-[11px] sm:text-xs text-muted-foreground/90 italic mb-1 sm:mb-2">
        Tip: click a command below or type it manually
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-y-1 sm:gap-y-0.5 font-mono text-xs sm:text-sm text-muted-foreground">
        {[...COMMANDS_ROW1, ...COMMANDS_ROW2].map((cmd) => (
          <span
            key={cmd}
            onClick={() => onCommand(cmd)}
            className="text-center cursor-pointer hover:text-primary transition-colors duration-150min-h-[26px] sm:min-h-[32px] flex items-center justify-center leading-tight"
          >
            {/* {cmd} */}
            {`[${cmd}]`} 
          </span>
        ))}
      </div>
    </div>
  );
};

export default CommandPanel;
