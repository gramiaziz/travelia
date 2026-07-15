export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
}

export interface Package {
  id: string;
  title: string;
  destination: string;
  destinationId: string;
  price: number;
  currency: string;
  durationDays: number;
  durationNights: number;
  departureDate: string;
  availablePlaces: number;
  description: string;
  imageUrl: string;
  included: string[];
  notIncluded: string[];
  program: { dayNumber: number; title: string; description: string }[];
  type: string;
  isActive: boolean;
}

export interface Reservation {
  id: string;
  packageId: string;
  packageTitle: string;
  fullName: string;
  email: string;
  phone: string;
  numberOfPeople: number;
  message: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}
