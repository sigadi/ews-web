import { Battery, Signal, Wifi } from "lucide-react";

export function StatusBar() {
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });

  return (
    <div className="bg-primary-600 text-white px-6 py-2 flex items-center justify-between">
      <span className="text-sm">{currentTime}</span>
      <div className="flex items-center gap-2">
        <Signal className="w-4 h-4" />
        <Wifi className="w-4 h-4" />
        <Battery className="w-4 h-4" />
      </div>
    </div>
  );
}
