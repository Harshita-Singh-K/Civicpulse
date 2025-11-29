import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Incident, incidentConfig } from '@/types/incident';
import { ThumbsUp, ThumbsDown, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface IncidentDetailsDialogProps {
  incident: Incident | null;
  open: boolean;
  onClose: () => void;
  onVote: (incidentId: string, voteType: 'up' | 'down') => void;
}

const IncidentDetailsDialog = ({ incident, open, onClose, onVote }: IncidentDetailsDialogProps) => {
  if (!incident) return null;

  const config = incidentConfig[incident.type];
  const totalVotes = incident.upvotes - incident.downvotes;
  const reliability = incident.upvotes + incident.downvotes > 0 
    ? Math.round((incident.upvotes / (incident.upvotes + incident.downvotes)) * 100)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-3xl">{config.icon}</span>
            <div>
              <div className="text-xl font-bold">{config.label}</div>
              <div className="text-sm text-muted-foreground font-normal">
                {formatDistanceToNow(incident.timestamp, { addSuffix: true })}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {incident.description && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{incident.description}</p>
            </div>
          )}

          {incident.images && incident.images.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Images</h4>
              <div className="grid grid-cols-1 gap-2">
                {incident.images.map((image, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden border border-border">
                    <img
                      src={image}
                      alt={`Incident image ${index + 1}`}
                      className="w-full h-auto max-h-64 object-contain bg-muted"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium">Reliability</span>
              </div>
              <div className="text-2xl font-bold">
                {incident.upvotes + incident.downvotes > 0 ? `${reliability}%` : 'New'}
              </div>
            </div>

            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-medium">Net Score</span>
              </div>
              <div className={`text-2xl font-bold ${totalVotes > 0 ? 'text-green-500' : totalVotes < 0 ? 'text-red-500' : ''}`}>
                {totalVotes > 0 ? '+' : ''}{totalVotes}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3 text-center">
              Is this report accurate?
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => onVote(incident.id, 'up')}
                variant="outline"
                className="flex-1 gap-2"
              >
                <ThumbsUp className="w-4 h-4" />
                Upvote
                <span className="ml-auto font-bold">{incident.upvotes}</span>
              </Button>
              <Button
                onClick={() => onVote(incident.id, 'down')}
                variant="outline"
                className="flex-1 gap-2"
              >
                <ThumbsDown className="w-4 h-4" />
                Downvote
                <span className="ml-auto font-bold">{incident.downvotes}</span>
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            Location: {incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IncidentDetailsDialog;