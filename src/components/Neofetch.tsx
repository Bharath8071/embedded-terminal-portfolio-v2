import { getNeofetchData } from '@/lib/commands';

const Neofetch = () => {
  const { asciiLetters, info } = getNeofetchData();

  return (
    <div className="flex flex-col lg:flex-row lg:items-start gap-3 sm:gap-5 lg:gap-12 py-3 sm:py-5 w-full overflow-hidden">

        {/* 🔥 LEFT SIDE (GROUPED) */}
        <div className="flex flex-col min-w-0 w-full lg:w-auto max-w-full lg:max-w-[60%]">

          {/* INTRO */}
          <div className="text-terminal-muted text-xs sm:text-sm md:text-[20px] opacity-60 mb-3 sm:mb-4">
            Hello! I'm
          </div>

          {/* ASCII */}
          <div
            className="overflow-x-auto grid grid-flow-col auto-cols-max gap-x-1 sm:gap-x-2 md:gap-x-2 lg:gap-x-4 place-items-start font-mono text-terminal-accent text-[9px] sm:text-xs md:text-sm lg:text-lg whitespace-pre select-none"
            aria-label="BHARATH logo"
          >
            {asciiLetters.map((letterLines, letterIdx) => (
              <div key={letterIdx} className="grid grid-rows-6 items-start">
                {letterLines.map((line, lineIdx) => (
                  <div key={lineIdx} className="leading-[1.25] sm:leading-[1.35]">
                    {line}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* ROLE */}
          {/* <div className="mt-2 text-green-400 text-xs sm:text-sm md:text-[17px]">
              $ EMBEDDED SOFTWARE ENGINEER
          </div> */}
          
        </div>
          
        {/* RIGHT SIDE */}
        <div className="flex flex-col min-w-0 break-words text-xs sm:text-sm md:text-base lg:text-lg">
          {info.map((item, i) => {
            if (item.isHeader) {
              return (
                <div key={i} className="text-terminal-accent font-bold">
                  {item.value}
                </div>
              );
            }
            if (!item.label && !item.value) {
              return <div key={i} className="h-2 sm:h-3" />;
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

          <div className="flex gap-1 sm:gap-1.5 mt-3 sm:mt-4">
            {['bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-blue-500', 'bg-purple-500', 'bg-cyan-500', 'bg-orange-500', 'bg-pink-500'].map((color, i) => (
              <div key={i} className={`w-3 h-3 sm:w-4 sm:h-4 rounded-sm ${color}`} />
            ))}
          </div>
        </div>
          
      </div>
  );
};

export default Neofetch;