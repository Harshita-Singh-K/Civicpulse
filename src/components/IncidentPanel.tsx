import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface IncidentPanelProps {
  incidentCount: number;
}

const IncidentPanel = ({ incidentCount }: IncidentPanelProps) => {
  return (
    <div className="absolute bottom-6 left-6 right-6 md:left-6 md:right-auto md:w-96 z-10 animate-in slide-in-from-bottom-4 duration-300">
      <Card className="bg-card/85 backdrop-blur-glass border-border/50 shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Report Incident</h2>
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
              {incidentCount} active
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-muted-foreground">
            <MapPin className="w-5 h-5" />
            <p className="text-sm">
              Tap anywhere on the map to report an incident
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default IncidentPanel;
