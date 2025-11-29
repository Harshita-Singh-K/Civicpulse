import { IncidentType, incidentConfig } from '@/types/incident';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface IncidentTypeDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectType: (type: IncidentType) => void;
}

const IncidentTypeDialog = ({ open, onClose, onSelectType }: IncidentTypeDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>What happened here?</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          {(Object.keys(incidentConfig) as IncidentType[]).map((type) => {
            const config = incidentConfig[type];
            
            return (
              <button
                key={type}
                onClick={() => {
                  onSelectType(type);
                }}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl transition-all duration-200",
                  "border-2 bg-card border-border hover:border-primary/50 hover:scale-105 active:scale-95"
                )}
              >
                <span className="text-2xl">{config.icon}</span>
                <span className="text-sm font-semibold text-left">
                  {config.label}
                </span>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IncidentTypeDialog;