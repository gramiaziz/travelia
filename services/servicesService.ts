import { supabase } from "@/lib/supabase";
import { mapService } from "@/services/mappers";

export async function getServices() {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map(mapService);
}

export async function getAllServices() {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map(mapService);
}

export async function getServiceById(id: string) {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return mapService(data);
}

export async function createService(service: {
  title: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
}) {
  const { data, error } = await supabase
    .from("services")
    .insert([
      {
        title: service.title,
        description: service.description,
        icon: service.icon,
        is_active: service.isActive ?? true,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return mapService(data);
}

export async function updateService(
  id: string,
  service: {
    title?: string;
    description?: string;
    icon?: string;
    isActive?: boolean;
  }
) {
  const updatePayload: any = {
    updated_at: new Date().toISOString(),
  };

  if (service.title !== undefined) updatePayload.title = service.title;
  if (service.description !== undefined) updatePayload.description = service.description;
  if (service.icon !== undefined) updatePayload.icon = service.icon;
  if (service.isActive !== undefined) updatePayload.is_active = service.isActive;

  const { data, error } = await supabase
    .from("services")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapService(data);
}

export async function deleteService(id: string) {
  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}