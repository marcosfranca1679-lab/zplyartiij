import { useEffect, useState } from "react";
import { Users } from "lucide-react";

const OnlineUsers = () => {
  const [userCount, setUserCount] = useState(100);

  useEffect(() => {
    const getStoredUsers = () => {
      const stored = localStorage.getItem("onlineUsers");
      if (stored) {
        const { count, timestamp } = JSON.parse(stored);
        const minutesPassed = (Date.now() - timestamp) / (1000 * 60);
        
        if (minutesPassed < 10) {
          return count;
        }
      }
      return null;
    };

    const generateRandomUserCount = (currentCount: number): number => {
      // Variação aleatória entre -5 e +5
      const variation = Math.floor(Math.random() * 11) - 5;
      const newCount = currentCount + variation;
      
      // Garante que está entre 600 e 890
      return Math.max(600, Math.min(890, newCount));
    };

    const storedUsers = getStoredUsers();
    if (storedUsers) {
      setUserCount(storedUsers);
    } else {
      // Começa com um valor aleatório entre 600 e 890
      const initialCount = Math.floor(Math.random() * 291) + 600;
      setUserCount(initialCount);
      localStorage.setItem("onlineUsers", JSON.stringify({
        count: initialCount,
        timestamp: Date.now()
      }));
    }

    const interval = setInterval(() => {
      setUserCount(prev => {
        const newCount = generateRandomUserCount(prev);
        localStorage.setItem("onlineUsers", JSON.stringify({
          count: newCount,
          timestamp: Date.now()
        }));
        return newCount;
      });
    }, 10 * 60 * 1000); // 10 minutos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-md border bg-primary/10 border-primary/30 shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-500">
      {/* Users Icon */}
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
        <Users className="w-5 h-5 text-primary animate-pulse" />
      </div>

      {/* User Info */}
      <div className="flex flex-col">
        <span className="text-xs font-medium text-muted-foreground">Usuários Online</span>
        <span className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {userCount.toLocaleString('pt-BR')}
        </span>
      </div>

      {/* Live Indicator */}
      <div className="flex items-center gap-1.5 ml-1">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-xs font-medium text-muted-foreground">LIVE</span>
      </div>
    </div>
  );
};

export default OnlineUsers;
