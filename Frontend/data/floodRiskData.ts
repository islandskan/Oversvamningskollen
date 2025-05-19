// Types
export interface FloodRiskArea {
  id: number;
  coordinate: { latitude: number; longitude: number };
  title: string;
  description: string;
  radius: number;
  riskLevel: 'high' | 'medium' | 'low' | string;
  detailedInfo: {
    waterLevel: string;
    probability: string;
    timeframe: string;
    affectedArea: string;
    evacuationStatus: string;
    emergencyContacts: string;
  };
}

// Sample flood risk data
export const floodRiskAreas: FloodRiskArea[] = [
  {
    id: 1,
    coordinate: { latitude: 55.6050, longitude: 13.0038 }, // Central Malmö
    title: "High Risk Area",
    description: "Severe flooding expected in central Malmö",
    radius: 800,
    riskLevel: "high",
    detailedInfo: {
      waterLevel: "2.5 meters above normal",
      probability: "75%",
      timeframe: "Next 24-48 hours",
      affectedArea: "Central Malmö, including Stortorget and surrounding streets",
      evacuationStatus: "Evacuation recommended",
      emergencyContacts: "Emergency Services: 112, Flood Hotline: 040-123456"
    }
  },
  {
    id: 2,
    coordinate: { latitude: 55.5872, longitude: 12.9701 }, // Near Limhamn
    title: "Medium Risk Area",
    description: "Moderate flooding possible near coastal areas",
    radius: 600,
    riskLevel: "medium",
    detailedInfo: {
      waterLevel: "1.2 meters above normal",
      probability: "50%",
      timeframe: "Next 48-72 hours",
      affectedArea: "Limhamn coastal areas and harbor",
      evacuationStatus: "Be prepared for possible evacuation",
      emergencyContacts: "Emergency Services: 112, Flood Hotline: 040-123456"
    }
  },
  {
    id: 3,
    coordinate: { latitude: 55.6204, longitude: 13.0320 }, // Near Kirseberg
    title: "Low Risk Area",
    description: "Minor flooding possible in eastern Malmö",
    radius: 500,
    riskLevel: "low",
    detailedInfo: {
      waterLevel: "0.5 meters above normal",
      probability: "25%",
      timeframe: "Next 3-5 days",
      affectedArea: "Parts of Kirseberg and surrounding low-lying areas",
      evacuationStatus: "No evacuation needed, stay informed",
      emergencyContacts: "Emergency Services: 112, Flood Hotline: 040-123456"
    }
  },
  {
    id: 4,
    coordinate: { latitude: 55.5698, longitude: 13.0415 }, // Near Hyllie
    title: "Medium Risk Area",
    description: "Moderate flooding expected in southern Malmö",
    radius: 700,
    riskLevel: "medium",
    detailedInfo: {
      waterLevel: "1.0 meters above normal",
      probability: "60%",
      timeframe: "Next 24-72 hours",
      affectedArea: "Hyllie and surrounding residential areas",
      evacuationStatus: "Be prepared for possible evacuation",
      emergencyContacts: "Emergency Services: 112, Flood Hotline: 040-123456"
    }
  }
];
