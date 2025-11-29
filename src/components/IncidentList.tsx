import { Incident, incidentConfig } from '@/types/incident';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface IncidentListProps {
  incidents: Incident[];
  onClose: () => void;
}

const IncidentList = ({ incidents, onClose }: IncidentListProps) => {
  const formatTime = (timestamp: number) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Just now';
    }
  };

  return (
    <Sheet open={true} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Incident Reports</SheetTitle>
          <SheetDescription>
            {incidents.length === 0 
              ? 'No incidents reported yet' 
              : `${incidents.length} incident${incidents.length !== 1 ? 's' : ''} reported`}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {incidents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No incidents to display</p>
              <p className="text-sm mt-2">Click on the map to report an incident</p>
            </div>
          ) : (
            incidents.map((incident) => {
              const config = incidentConfig[incident.type];
              return (
                <div
                  key={incident.id}
                  className="bg-card/85 backdrop-blur-glass border border-border/50 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className="text-2xl flex-shrink-0"
                        style={{
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                        }}
                      >
                        {config.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">
                            {config.label}
                          </h3>
                          <Badge
                            variant={incident.status === 'active' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {incident.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {formatTime(incident.timestamp)}
                        </p>
                        {incident.description && (
                          <p className="text-sm text-foreground/80 mb-2 line-clamp-2">
                            {incident.description}
                          </p>
                        )}
                        {incident.images && incident.images.length > 0 && (
                          <div className="mb-2">
                            <div className="flex gap-2 overflow-x-auto">
                              {incident.images.slice(0, 3).map((image, index) => (
                                <div
                                  key={index}
                                  className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-border"
                                >
                                  <img
                                    src={image}
                                    alt={`Incident ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                              {incident.images.length > 3 && (
                                <div className="flex-shrink-0 w-16 h-16 rounded-lg border border-border bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                  +{incident.images.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>👍 {incident.upvotes}</span>
                          <span>👎 {incident.downvotes}</span>
                          <span>
                            📍 {incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default IncidentList;