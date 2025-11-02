import { useState } from "react";
import { Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const HowToWatch = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 z-50 h-16 px-8 rounded-2xl shadow-[0_0_40px_rgba(13,203,237,0.4)] bg-gradient-to-br from-primary via-primary to-accent hover:shadow-[0_0_60px_rgba(13,203,237,0.6)] animate-pulse hover:animate-none transition-all duration-500 hover:scale-110 border-2 border-primary/30 backdrop-blur-sm"
            size="lg"
          >
            <Play className="mr-2 h-6 w-6 fill-current" />
            <span className="font-bold text-base tracking-wide">COMO ASSISTIR</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-4xl w-[95vw] p-0 bg-background/95 backdrop-blur-xl border-primary/20">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Como Assistir ZPLAYER
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 pt-2">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-2xl border border-primary/10">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/vZKJcEDP_gk"
                title="Como Assistir ZPLAYER"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HowToWatch;
