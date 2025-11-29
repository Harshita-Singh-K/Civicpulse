import { useEffect, useRef, useState } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import { Incident, incidentConfig } from '@/types/incident';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface TomTomMapProps {
  incidents: Incident[];
  onMapClick: (lat: number, lng: number) => void;
  onMarkerClick: (incidentId: string) => void;
}

const TomTomMap = ({ incidents, onMapClick, onMarkerClick }: TomTomMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markers = useRef<Map<string, any>>(new Map());
  const [apiKey, setApiKey] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!apiKey || !mapContainer.current || map.current) return;

    try {
      map.current = tt.map({
        key: apiKey,
        container: mapContainer.current,
        center: [-74.006, 40.7128], // New York
        zoom: 12,
        style: 'https://api.tomtom.com/style/1/style/22.2.1-*?map=basic_main&poi=poi_main',
      });

      map.current.addControl(new tt.NavigationControl());

      map.current.on('click', (e: any) => {
        onMapClick(e.lngLat.lat, e.lngLat.lng);
      });

      setIsInitialized(true);
      toast({
        title: "Map loaded successfully",
        description: "Click on the map to place incident markers",
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error loading map",
        description: "Please check your TomTom API key",
        variant: "destructive",
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [apiKey]);

  useEffect(() => {
    if (!map.current || !isInitialized) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current.clear();

    // Add new markers
    incidents.forEach(incident => {
      const config = incidentConfig[incident.type];
      const el = document.createElement('div');
      el.className = 'incident-marker';
      el.innerHTML = `
        <div style="
          background: hsl(var(--${config.color}));
          color: white;
          padding: 8px 12px;
          border-radius: 12px;
          font-size: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          cursor: pointer;
          transition: transform 0.2s;
        " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
          ${config.icon}
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onMarkerClick(incident.id);
      });

      const marker = new tt.Marker({ element: el })
        .setLngLat([incident.location.lng, incident.location.lat])
        .addTo(map.current);

      markers.current.set(incident.id, marker);
    });
  }, [incidents, isInitialized]);

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-screen bg-muted">
        <div className="bg-card p-8 rounded-xl shadow-lg max-w-md w-full mx-4 backdrop-blur-glass border border-border">
          <h2 className="text-2xl font-bold mb-4">Enter TomTom API Key</h2>
          <p className="text-muted-foreground mb-4">
            Get your free API key from{' '}
            <a 
              href="https://developer.tomtom.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              TomTom Developer Portal
            </a>
          </p>
          <Input
            type="text"
            placeholder="Your TomTom API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && apiKey) {
                setApiKey(apiKey);
              }
            }}
            className="mb-4"
          />
          <button
            onClick={() => {
              if (apiKey) {
                setApiKey(apiKey);
              }
            }}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Load Map
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-screen"
      style={{ cursor: 'crosshair' }}
    />
  );
};

export default TomTomMap;
