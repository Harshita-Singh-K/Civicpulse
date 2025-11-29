import { useState } from 'react';
import TomTomMap from '@/components/Map/TomTomMap';
import IncidentPanel from '@/components/IncidentPanel';
import IncidentList from '@/components/IncidentList';
import IncidentTypeDialog from '@/components/IncidentTypeDialog';
import IncidentDetailsDialog from '@/components/IncidentDetailsDialog';
import IncidentDetailsFormDialog from '@/components/IncidentDetailsFormDialog';
import { Incident, IncidentType, incidentConfig } from '@/types/incident';
import { toast } from '@/hooks/use-toast';
import { List } from 'lucide-react';

const Index = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [showList, setShowList] = useState(false);
  const [pendingLocation, setPendingLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedType, setSelectedType] = useState<IncidentType | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const handleMapClick = (lat: number, lng: number) => {
    setPendingLocation({ lat, lng });
  };

  const handleSelectType = (type: IncidentType) => {
    if (!pendingLocation) return;
    setSelectedType(type);
  };

  const handleFormSubmit = (data: { description: string; image?: string }) => {
    if (!pendingLocation || !selectedType) return;

    const newIncident: Incident = {
      id: `incident-${Date.now()}`,
      type: selectedType,
      location: pendingLocation,
      timestamp: Date.now(),
      status: 'active',
      description: data.description,
      images: data.image ? [data.image] : undefined,
      upvotes: 0,
      downvotes: 0,
    };

    setIncidents([...incidents, newIncident]);
    setPendingLocation(null);
    setSelectedType(null);
    
    toast({
      title: "Incident reported",
      description: "Your report has been added to the map",
    });
  };

  const handleFormCancel = () => {
    setPendingLocation(null);
    setSelectedType(null);
  };

  const handleMarkerClick = (incidentId: string) => {
    const incident = incidents.find(i => i.id === incidentId);
    if (incident) {
      setSelectedIncident(incident);
    }
  };

  const handleVote = (incidentId: string, voteType: 'up' | 'down') => {
    const updatedIncidents = incidents.map(incident => {
      if (incident.id === incidentId) {
        const updated = {
          ...incident,
          upvotes: voteType === 'up' ? incident.upvotes + 1 : incident.upvotes,
          downvotes: voteType === 'down' ? incident.downvotes + 1 : incident.downvotes,
        };
        // Update selectedIncident if it's the one being voted on
        if (selectedIncident?.id === incidentId) {
          setSelectedIncident(updated);
        }
        return updated;
      }
      return incident;
    });
    setIncidents(updatedIncidents);

    toast({
      title: voteType === 'up' ? "Upvoted" : "Downvoted",
      description: "Thanks for helping verify this report",
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <TomTomMap 
        incidents={incidents}
        onMapClick={handleMapClick}
        onMarkerClick={handleMarkerClick}
      />
      
      <IncidentPanel 
        incidentCount={incidents.filter(i => i.status === 'active').length}
      />

      <button
        onClick={() => setShowList(!showList)}
        className="absolute top-6 right-6 z-10 bg-card/85 backdrop-blur-glass border border-border/50 p-4 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <List className="w-6 h-6" />
      </button>

      <IncidentTypeDialog
        open={!!pendingLocation && !selectedType}
        onClose={handleFormCancel}
        onSelectType={handleSelectType}
      />

      <IncidentDetailsFormDialog
        open={!!pendingLocation && !!selectedType}
        onClose={handleFormCancel}
        onSubmit={handleFormSubmit}
        incidentType={selectedType ? incidentConfig[selectedType].label : ''}
      />

      <IncidentDetailsDialog
        incident={selectedIncident}
        open={!!selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onVote={handleVote}
      />

      {showList && (
        <IncidentList 
          incidents={incidents}
          onClose={() => setShowList(false)}
        />
      )}
    </div>
  );
};

export default Index;