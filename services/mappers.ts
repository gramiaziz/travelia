import { Destination, Package, Reservation, ContactMessage, Service } from "@/types";

export function mapDestination(row: any): Destination {
  return {
    id: row.id,
    name: row.name,
    country: row.country,
    description: row.description ?? "",
    imageUrl: row.image_url ?? "",
    isActive: row.is_active ?? true,
  };
}

export function mapOffer(row: any): Package {
  const destinationName = row.destinations
    ? `${row.destinations.name}, ${row.destinations.country}`
    : "";

  return {
    id: row.id,
    title: row.title,
    destination: destinationName,
    destinationId: row.destination_id,
    price: Number(row.price),
    currency: row.currency ?? "TND",
    durationDays: row.duration_days,
    durationNights: row.duration_nights,
    departureDate: row.departure_date,
    availablePlaces: row.available_places ?? 0,
    type: row.type ?? "",
    description: row.description ?? "",
    imageUrl: row.image_url ?? "",
    included: row.offer_included_items?.map((item: any) => item.item) ?? [],
    notIncluded: row.offer_not_included_items?.map((item: any) => item.item) ?? [],
    program:
      row.offer_program_steps
        ?.map((step: any) => ({
          dayNumber: step.day_number,
          title: step.title,
          description: step.description,
        }))
        .sort((a: any, b: any) => a.dayNumber - b.dayNumber) ?? [],
    isActive: row.is_active ?? true,
  };
}

export function mapReservation(row: any): Reservation {
  return {
    id: row.id,
    packageId: row.offer_id,
    packageTitle: row.offers?.title ?? "",
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    numberOfPeople: row.number_of_people,
    message: row.message ?? "",
    status: row.status,
    createdAt: row.created_at,
  };
}

export function mapContactMessage(row: any): ContactMessage {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone ?? "",
    subject: row.subject ?? "",
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  };
}

export function mapService(row: any): Service {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    icon: row.icon ?? "Globe",
  };
}