import { useEffect, useState } from "react";

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
          color: "from-green-500 to-emerald-400",
          barColor: "bg-green-500",
          text: "Excelente",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/30",
          glowColor: "shadow-[0_0_20px_rgba(34,197,94,0.3)]"
        };
      case "good":
        return {
          color: "from-blue-500 to-cyan-400",
          barColor: "bg-blue-500",
          text: "Bom",
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-500/30",
          glowColor: "shadow-[0_0_20px_rgba(59,130,246,0.3)]"
        };
      case "medium":
        return {
          color: "from-yellow-500 to-amber-400",
          barColor: "bg-yellow-500",
          text: "Médio",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/30",
          glowColor: "shadow-[0_0_20px_rgba(234,179,8,0.3)]"
        };
    }
  };

  const config = getSignalConfig();
  const bars = signalLevel === "excellent" ? 4 : signalLevel === "good" ? 3 : 2;

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-md border ${config.bgColor} ${config.borderColor} ${config.glowColor} transition-all duration-500`}>
      {/* Signal Bars */}
      <div className="flex items-end gap-1 h-6">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={`w-1.5 rounded-full transition-all duration-500 ${
              bar <= bars ? config.barColor : "bg-muted/30"
            }`}
            style={{
              height: `${bar * 25}%`,
              animation: bar <= bars ? "pulse 2s ease-in-out infinite" : "none",
              animationDelay: `${bar * 0.1}s`
            }}
          />
        ))}
      </div>

      {/* Signal Info */}
      <div className="flex flex-col">
        <span className="text-xs font-medium text-muted-foreground">Qualidade</span>
        <span className={`text-sm font-bold bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}>
          {config.text}
        </span>
      </div>

      {/* Live Indicator */}
      <div className="flex items-center gap-1.5 ml-1">
        <div className={`w-2 h-2 rounded-full ${config.barColor} animate-pulse`} />
        <span className="text-xs font-medium text-muted-foreground">LIVE</span>
      </div>
    </div>
  );
};

export default SignalQuality;
