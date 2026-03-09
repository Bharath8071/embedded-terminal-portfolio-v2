import { getNeofetchData } from '@/lib/commands';

const Neofetch = () => {
  const { asciiLetters, info } = getNeofetchData();

  return (
    <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-12 py-4">
      <div
        className="shrink-0 grid grid-flow-col auto-cols-max gap-x-3.5 place-items-start font-mono text-terminal-accent text-sm sm:text-base md:text-lg lg:text-xl whitespace-pre select-none"
        aria-label="BHARATH logo"
      >
        {asciiLetters.map((letterLines, letterIdx) => (
          <div key={letterIdx} className="grid grid-rows-6 items-start">
            {letterLines.map((line, lineIdx) => (
              <div key={lineIdx} className="leading-[1.29]">
                {line}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex flex-col text-base md:text-lg">
        {info.map((item, i) => {
          if (item.isHeader) {
            return (
              <div key={i} className="text-terminal-accent font-bold">
                {item.value}
              </div>
            );
          }
          if (!item.label && !item.value) {
            return <div key={i} className="h-2" />;
          }
          if (!item.label) {
            return (
              <div key={i} className="text-terminal-muted">
                {item.value}
              </div>
            );
          }
          return (
            <div key={i}>
              <span className="text-terminal-accent font-semibold">{item.label}</span>
              <span className="text-terminal-muted">: </span>
              <span className="text-foreground">{item.value}</span>
            </div>
          );
        })}
        <div className="flex gap-1 mt-3">
          {['bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-blue-500', 'bg-purple-500', 'bg-cyan-500', 'bg-orange-500', 'bg-pink-500'].map((color, i) => (
            <div key={i} className={`w-4 h-4 rounded-sm ${color}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Neofetch;
