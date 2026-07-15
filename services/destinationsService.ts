import { supabase } from "@/lib/supabase";
import { mapDestination } from "@/services/mappers";

export async function getDestinations() {
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapDestination);
}

export async function getAllDestinations() {
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapDestination);
}

export async function getDestinationById(id: string) {
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return mapDestination(data);
}

export async function createDestination(destination: {
  name: string;
  country: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
}) {
  const { data, error } = await supabase
    .from("destinations")
    .insert([
      {
        name: destination.name,
        country: destination.country,
        description: destination.description,
        image_url: destination.imageUrl,
        is_active: destination.isActive ?? true,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return mapDestination(data);
}

export async function updateDestination(
  id: string,
  destination: {
    name?: string;
    country?: string;
    description?: string;
    imageUrl?: string;
    isActive?: boolean;
  }
) {
  const { data, error } = await supabase
    .from("destinations")
    .update({
      name: destination.name,
      country: destination.country,
      description: destination.description,
      image_url: destination.imageUrl,
      is_active: destination.isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapDestination(data);
}

export async function deleteDestination(id: string) {
  const { error } = await supabase
    .from("destinations")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}

export async function getOffersCountByDestination(destinationId: string) {
  const { count, error } = await supabase
    .from("offers")
    .select("*", { count: "exact", head: true })
    .eq("destination_id", destinationId)
    .eq("is_active", true);

  if (error) throw error;
  return count ?? 0;
}

export function formatOffersCount(count: number) {
  if (count === 0) return "0 offre disponible";
  if (count === 1) return "1 offre disponible";
  return `${count} offres disponibles`;
}