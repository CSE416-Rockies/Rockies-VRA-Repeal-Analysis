export default function Legend({ items, small = false }) {

  const SHAPES = {
    circle: (color, small) => (
        <div className={`rounded-full ${small ? "w-3 h-3" : "w-4 h-4"}`} style={{ backgroundColor: color }} />
    ),
    square: (color, small) => (
        <div className={`rounded-sm ${small ? "w-3 h-3" : "w-4 h-4"} border-2 border-black`} style={{ backgroundColor: color }} />
    ),
    boxplot: () => (
        <svg width="16" height="16" viewBox="0 0 16 16">
            <line x1="2" y1="8" x2="14" y2="8" stroke="black" strokeWidth="2"/>
            <line x1="2" y1="5" x2="2" y2="11" stroke="black" strokeWidth="2"/>
            <line x1="14" y1="5" x2="14" y2="11" stroke="black" strokeWidth="2"/>
        </svg>
    ),
};

  return (
    <div className= {`flex flex-col bg-white border-2 border-gray-300 rounded-md justify-center w-fit h-fit ${small ? "px-4 py-1 gap-1" : "px-7 py-2 gap-2"}`}>

      {items.map(({ label, color, shape= "circle"}) => (
        <div key={label} className="flex gap-2 items-center">
          {SHAPES[shape]?.(color, small)}
          <div className= {`capitalize ${small ? "text-xs" : "text-sm" }`}>{label}</div>
        </div>
      ))}
    </div>
  );
}