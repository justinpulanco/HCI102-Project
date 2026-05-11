export default function StudyingGirlAnimation() {
  return (
    <svg viewBox="0 0 400 400" className="studying-girl-animation">
      <defs>
        <style>{`
          @keyframes bobbing {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes writing {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-5deg); }
          }
          @keyframes typing {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          .girl-body { animation: bobbing 3s ease-in-out infinite; }
          .pen { animation: writing 2s ease-in-out infinite; transform-origin: 85% 10%; }
          .laptop { animation: typing 2.5s ease-in-out infinite; }
        `}</style>
      </defs>

      {/* Background */}
      <rect width="400" height="400" fill="#f5f3fa" />

      {/* Notebook */}
      <g className="notebook">
        <rect x="80" y="240" width="120" height="100" rx="8" fill="#e8e5f0" />
        <line x1="90" y1="260" x2="190" y2="260" stroke="#4f46e5" strokeWidth="2" />
        <line x1="90" y1="280" x2="190" y2="280" stroke="#4f46e5" strokeWidth="2" />
        <line x1="90" y1="300" x2="170" y2="300" stroke="#4f46e5" strokeWidth="2" />
      </g>

      {/* Laptop */}
      <g className="laptop">
        <rect x="200" y="220" width="140" height="90" rx="6" fill="#c0c0c0" />
        <rect x="205" y="225" width="130" height="70" rx="4" fill="#1a1a2e" />
        <rect x="210" y="230" width="120" height="60" fill="#4f46e5" opacity="0.3" />
        <line x1="200" y1="310" x2="340" y2="310" stroke="#c0c0c0" strokeWidth="3" />
        <circle cx="270" cy="320" r="4" fill="#999" />
      </g>

      {/* Pen */}
      <g className="pen">
        <rect x="310" y="180" width="8" height="80" rx="4" fill="#ff6b6b" />
        <circle cx="314" cy="175" r="5" fill="#ffd93d" />
      </g>

      {/* Girl Body */}
      <g className="girl-body">
        {/* Head */}
        <circle cx="200" cy="100" r="35" fill="#f4a460" />
        
        {/* Hair */}
        <path d="M 165 100 Q 165 65 200 60 Q 235 65 235 100" fill="#2c3e50" />
        <path d="M 170 95 Q 170 75 200 70 Q 230 75 230 95" fill="#34495e" />
        
        {/* Eyes */}
        <circle cx="190" cy="95" r="3" fill="#000" />
        <circle cx="210" cy="95" r="3" fill="#000" />
        
        {/* Smile */}
        <path d="M 190 110 Q 200 115 210 110" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
        
        {/* Body */}
        <rect x="170" y="135" width="60" height="70" rx="8" fill="#4f46e5" />
        
        {/* Arms */}
        <rect x="140" y="145" width="30" height="15" rx="7" fill="#f4a460" />
        <rect x="230" y="145" width="30" height="15" rx="7" fill="#f4a460" />
        
        {/* Hands */}
        <circle cx="135" cy="152" r="8" fill="#f4a460" />
        <circle cx="265" cy="152" r="8" fill="#f4a460" />
        
        {/* Legs */}
        <rect x="180" y="205" width="12" height="50" rx="6" fill="#2c3e50" />
        <rect x="208" y="205" width="12" height="50" rx="6" fill="#2c3e50" />
        
        {/* Shoes */}
        <ellipse cx="186" cy="260" rx="10" ry="8" fill="#000" />
        <ellipse cx="214" cy="260" rx="10" ry="8" fill="#000" />
      </g>

      {/* Floating elements */}
      <g opacity="0.3">
        <circle cx="80" cy="80" r="15" fill="#4f46e5" />
        <rect x="320" y="100" width="20" height="20" fill="#4f46e5" />
        <circle cx="350" cy="280" r="12" fill="#4f46e5" />
      </g>
    </svg>
  )
}
