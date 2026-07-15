import { supabase } from "@/lib/supabase";
import { mapReservation } from "@/services/mappers";

export async function createReservation(reservation: {
  packageId?: string;
  fullName: string;
  email: string;
  phone: string;
  numberOfPeople: number;
  message?: string;
}) {
  const { data, error } = await supabase
    .from("reservations")
    .insert([
      {
        offer_id: reservation.packageId,
        full_name: reservation.fullName,
        email: reservation.email,
        phone: reservation.phone,
        number_of_people: reservation.numberOfPeople,
        message: reservation.message,
        status: "pending",
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return mapReservation(data);
}

export async function getReservations() {
  const { data, error } = await supabase
    .from("reservations")
    .select(`
      *,
      offers (
        id,
        title,
        destinations (
          id,
          name,
          country
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map(mapReservation);
}

export async function getReservationById(id: string) {
  const { data, error } = await supabase
    .from("reservations")
    .select(`
      *,
      offers (
        id,
        title,
        destinations (
          id,
          name,
          country
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return mapReservation(data);
}

export async function updateReservationStatus(
  id: string,
  status: "pending" | "confirmed" | "cancelled"
) {
  const { data, error } = await supabase
    .from("reservations")
    .update({ status })
    .eq("id", id)
    .select(`
      *,
      offers (
        id,
        title,
        destinations (
          id,
          name,
          country
        )
      )
    `)
    .single();

  if (error) throw error;
  return mapReservation(data);
}

export async function deleteReservation(id: string) {
  const { error } = await supabase
    .from("reservations")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}