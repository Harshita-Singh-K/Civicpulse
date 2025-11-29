export type IncidentType = 
  | 'crash' 
  | 'slowdown' 
  | 'construction' 
  | 'laneClosure' 
  | 'object' 
  | 'flood' 
  | 'visibility';

export interface Incident {
  id: string;
  type: IncidentType;
  location: {
    lat: number;
    lng: number;
  };
  timestamp: number;
  status: 'active' | 'resolved';
  description?: string;
  images?: string[];
  upvotes: number;
  downvotes: number;
}

export const incidentConfig: Record<IncidentType, { 
  label: string; 
  icon: string;
  color: string;
}> = {
  crash: { 
    label: 'Crash', 
    icon: '🚗💥',
    color: 'incident-crash'
  },
  slowdown: { 
    label: 'Slowdown', 
    icon: '🐌',
    color: 'incident-slowdown'
  },
  construction: { 
    label: 'Construction', 
    icon: '🚧',
    color: 'incident-construction'
  },
  laneClosure: { 
    label: 'Lane Closure', 
    icon: '🚫',
    color: 'incident-laneClosure'
  },
  object: { 
    label: 'Object on Road', 
    icon: '⚠️',
    color: 'incident-object'
  },
  flood: { 
    label: 'Flooded Road', 
    icon: '💧',
    color: 'incident-flood'
  },
  visibility: { 
    label: 'Low Visibility', 
    icon: '🌫️',
    color: 'incident-visibility'
  },
};