import { useState } from 'react';

function ChatButton({ onClick, hasDocument }) {
  const [isHovered, setIsHovered] = useState(false);

  if (!hasDocument) return null; // Only show when document is uploaded

  return (
    <div className="fixed right-6 bottom-6 z-40">
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-osmo-purple text-white p-4 rounded-full shadow-osmo-lg hover:shadow-osmo hover:transform hover:translate-y-[-2px] transition-all duration-300 group"
      >
        <div className="w-8 h-8 flex items-center justify-center">
          <span className="text-2xl group-hover:scale-110 transition-transform">💬</span>
        </div>
      </button>
      
      {/* Tooltip */}
      {isHovered && (
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-osmo-dark text-white px-4 py-2 rounded-osmo text-sm whitespace-nowrap shadow-osmo">
          Chat with AI Expert
          <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-osmo-dark border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
        </div>
      )}
    </div>
  );
}

export default ChatButton;
