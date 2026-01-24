import { Home, Calendar, FileText, User } from "lucide-react";
import type { ScreenName } from "@/types/screen";

interface BottomNavProps {
  activeTab: ScreenName;
  onTabChange: (tab: ScreenName) => void;
}



export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'scheduling', label: 'Jadwal', icon: Calendar },
    { id: 'education', label: 'Edukasi', icon: FileText },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as ScreenName)}
              className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors ${
                isActive ? 'text-primary-600' : 'text-gray-400'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}