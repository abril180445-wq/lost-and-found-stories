import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ExternalLink, X, Loader2 } from "lucide-react";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    subtitle: string;
    url: string;
    type: string;
  } | null;
  screenshots: string[];
  screenshotLabels: string[];
  isLoading?: boolean;
}

const ProjectModal = ({ isOpen, onClose, project, screenshots, screenshotLabels, isLoading }: ProjectModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!project) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
  };

  const validScreenshots = screenshots.filter(Boolean);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 bg-background/95 backdrop-blur-xl border-border overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-background to-transparent">
          <div>
            <h3 className="text-xl font-bold text-foreground">{project.title}</h3>
            <p className="text-sm text-muted-foreground">{project.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="bg-background/50 backdrop-blur-sm"
            >
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                Acessar Sistema <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col h-full pt-20 pb-4">
          {/* Main Screenshot */}
          <div className="flex-1 relative flex items-center justify-center px-4">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-muted-foreground">Carregando screenshots...</p>
              </div>
            ) : validScreenshots.length > 0 ? (
              <>
                <img
                  src={validScreenshots[currentIndex]}
                  alt={`${project.title} - ${screenshotLabels[currentIndex] || `Tela ${currentIndex + 1}`}`}
                  className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
                />
                
                {/* Navigation Arrows */}
                {validScreenshots.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handlePrev}
                      className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleNext}
                      className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary">{project.title.charAt(0)}</span>
                </div>
                <p className="text-muted-foreground">Nenhum screenshot disponível</p>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {validScreenshots.length > 1 && (
            <div className="flex items-center justify-center gap-3 px-4 pt-4">
              {validScreenshots.map((screenshot, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? "border-primary shadow-lg shadow-primary/20"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={screenshot}
                    alt={screenshotLabels[index] || `Tela ${index + 1}`}
                    className="w-full h-full object-cover object-top"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Screen Label */}
          {validScreenshots.length > 0 && (
            <div className="text-center mt-3">
              <span className="text-sm text-muted-foreground">
                {screenshotLabels[currentIndex] || `Tela ${currentIndex + 1}`} ({currentIndex + 1}/{validScreenshots.length})
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
