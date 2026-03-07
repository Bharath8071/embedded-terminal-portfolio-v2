import { getNeofetchData } from '@/lib/commands';

const Neofetch = () => {
  const { ascii, info } = getNeofetchData();

  return (
    <div className="flex flex-col lg:flex-row gap-2 lg:gap-8 py-2">
      <div className="shrink-0">
        {ascii.map((line, i) => (
          <div key={i} className="text-terminal-accent text-[0.5rem] sm:text-xs leading-tight whitespace-pre">
            {line}
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-center text-sm">
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
