import { supabase } from "@/lib/supabase";
import { mapContactMessage } from "@/services/mappers";

export async function createContactMessage(contactMessage: {
  fullName: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  const { data, error } = await supabase
    .from("contact_messages")
    .insert([
      {
        full_name: contactMessage.fullName,
        email: contactMessage.email,
        phone: contactMessage.phone,
        subject: contactMessage.subject,
        message: contactMessage.message,
        status: "new",
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return mapContactMessage(data);
}

export async function getContactMessages() {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map(mapContactMessage);
}

export async function getContactMessageById(id: string) {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return mapContactMessage(data);
}

export async function updateContactMessageStatus(
  id: string,
  status: "new" | "read" | "replied"
) {
  const { data, error } = await supabase
    .from("contact_messages")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapContactMessage(data);
}

export async function deleteContactMessage(id: string) {
  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}