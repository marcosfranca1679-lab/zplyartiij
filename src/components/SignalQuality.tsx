import { useEffect, useState } from "react";
import { Wifi } from "lucide-react";

type SignalLevel = "excellent" | "good" | "medium";

const SignalQuality = () => {
  const [signalLevel, setSignalLevel] = useState<SignalLevel>("excellent");

  useEffect(() => {
    const getStoredSignal = () => {
      const stored = localStorage.getItem("signalQuality");
      if (stored) {
        const { level, timestamp } = JSON.parse(stored);
        const hoursPassed = (Date.now() - timestamp) / (1000 * 60 * 60);
        
        if (hoursPassed < 1) {
          return level;
        }
      }
      return null;
    };

    const generateRandomSignal = (): SignalLevel => {
      const signals: SignalLevel[] = ["excellent", "excellent", "good", "medium"];
      return signals[Math.floor(Math.random() * signals.length)];
    };

    const storedSignal = getStoredSignal();
    if (storedSignal) {
      setSignalLevel(storedSignal);
    } else {
      const newSignal = generateRandomSignal();
      setSignalLevel(newSignal);
      localStorage.setItem("signalQuality", JSON.stringify({
        level: newSignal,
        timestamp: Date.now()
      }));
    }

    const interval = setInterval(() => {
      const newSignal = generateRandomSignal();
      setSignalLevel(newSignal);
      localStorage.setItem("signalQuality", JSON.stringify({
        level: newSignal,
        timestamp: Date.now()
      }));
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const getSignalConfig = () => {
    switch (signalLevel) {
      case "excellent":
        return {
          color: "text-green-500",
          bars: 4,
          text: "Excelente",
          bgColor: "bg-green-500/10"
        };
      case "good":
        return {
          color: "text-primary",
          bars: 3,
          text: "Bom",
          bgColor: "bg-primary/10"
        };
      case "medium":
        return {
          color: "text-yellow-500",
          bars: 2,
          text: "Médio",
          bgColor: "bg-yellow-500/10"
        };
    }
  };

  const config = getSignalConfig();

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
      <div className="relative">
        <Wifi className={`h-5 w-5 ${config.color}`} strokeWidth={2.5} />
        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-foreground">Sinal</span>
        <span className={`text-xs font-medium ${config.color}`}>{config.text}</span>
      </div>
    </div>
  );
};

export default SignalQuality;
