import { supabase } from "@/lib/supabase";
import { mapOffer } from "@/services/mappers";

const offerSelect = `
  *,
  destinations (
    id,
    name,
    country
  ),
  offer_program_steps (
    id,
    day_number,
    title,
    description
  ),
  offer_included_items (
    id,
    item
  ),
  offer_not_included_items (
    id,
    item
  ),
  offer_images (
    id,
    image_url
  )
`;

export async function getOffers() {
  const { data, error } = await supabase
    .from("offers")
    .select(offerSelect)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map(mapOffer);
}

export async function getAllOffers() {
  const { data, error } = await supabase
    .from("offers")
    .select(offerSelect)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map(mapOffer);
}

export async function getOffersByDestination(destinationId: string) {
  const { data, error } = await supabase
    .from("offers")
    .select(offerSelect)
    .eq("destination_id", destinationId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map(mapOffer);
}

export async function getOfferById(id: string) {
  const { data, error } = await supabase
    .from("offers")
    .select(offerSelect)
    .eq("id", id)
    .single();

  if (error) throw error;
  return mapOffer(data);
}

export async function createOffer(offer: {
  destinationId: string;
  title: string;
  price: number;
  currency?: string;
  durationDays: number;
  durationNights: number;
  departureDate?: string;
  availablePlaces?: number;
  type?: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
}) {
  const { data, error } = await supabase
    .from("offers")
    .insert([
      {
        destination_id: offer.destinationId,
        title: offer.title,
        price: offer.price,
        currency: offer.currency ?? "TND",
        duration_days: offer.durationDays,
        duration_nights: offer.durationNights,
        departure_date: offer.departureDate,
        available_places: offer.availablePlaces ?? 0,
        type: offer.type,
        description: offer.description,
        image_url: offer.imageUrl,
        is_active: offer.isActive ?? true,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateOffer(
  id: string,
  offer: {
    destinationId?: string;
    title?: string;
    price?: number;
    currency?: string;
    durationDays?: number;
    durationNights?: number;
    departureDate?: string;
    availablePlaces?: number;
    type?: string;
    description?: string;
    imageUrl?: string;
    isActive?: boolean;
  }
) {
  const updatePayload: any = {
    updated_at: new Date().toISOString(),
  };

  if (offer.destinationId !== undefined) updatePayload.destination_id = offer.destinationId;
  if (offer.title !== undefined) updatePayload.title = offer.title;
  if (offer.price !== undefined) updatePayload.price = offer.price;
  if (offer.currency !== undefined) updatePayload.currency = offer.currency;
  if (offer.durationDays !== undefined) updatePayload.duration_days = offer.durationDays;
  if (offer.durationNights !== undefined) updatePayload.duration_nights = offer.durationNights;
  if (offer.departureDate !== undefined) updatePayload.departure_date = offer.departureDate;
  if (offer.availablePlaces !== undefined) updatePayload.available_places = offer.availablePlaces;
  if (offer.type !== undefined) updatePayload.type = offer.type;
  if (offer.description !== undefined) updatePayload.description = offer.description;
  if (offer.imageUrl !== undefined) updatePayload.image_url = offer.imageUrl;
  if (offer.isActive !== undefined) updatePayload.is_active = offer.isActive;

  const { data, error } = await supabase
    .from("offers")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteOffer(id: string) {
  const { error } = await supabase
    .from("offers")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}

export async function replaceOfferProgram(
  offerId: string,
  program: {
    dayNumber: number;
    title: string;
    description: string;
  }[]
) {
  const { error: deleteError } = await supabase
    .from("offer_program_steps")
    .delete()
    .eq("offer_id", offerId);

  if (deleteError) throw deleteError;

  const cleanProgram = program.filter(
    (step) =>
      step.dayNumber &&
      step.title.trim() !== "" &&
      step.description.trim() !== ""
  );

  if (cleanProgram.length === 0) return [];

  const rows = cleanProgram.map((step) => ({
    offer_id: offerId,
    day_number: step.dayNumber,
    title: step.title,
    description: step.description,
  }));

  const { data, error } = await supabase
    .from("offer_program_steps")
    .insert(rows)
    .select();

  if (error) throw error;
  return data;
}

export async function replaceOfferIncludedItems(
  offerId: string,
  items: string[]
) {
  const { error: deleteError } = await supabase
    .from("offer_included_items")
    .delete()
    .eq("offer_id", offerId);

  if (deleteError) throw deleteError;

  const cleanItems = items.filter((item) => item.trim() !== "");

  if (cleanItems.length === 0) return [];

  const rows = cleanItems.map((item) => ({
    offer_id: offerId,
    item,
  }));

  const { data, error } = await supabase
    .from("offer_included_items")
    .insert(rows)
    .select();

  if (error) throw error;
  return data;
}

export async function replaceOfferNotIncludedItems(
  offerId: string,
  items: string[]
) {
  const { error: deleteError } = await supabase
    .from("offer_not_included_items")
    .delete()
    .eq("offer_id", offerId);

  if (deleteError) throw deleteError;

  const cleanItems = items.filter((item) => item.trim() !== "");

  if (cleanItems.length === 0) return [];

  const rows = cleanItems.map((item) => ({
    offer_id: offerId,
    item,
  }));

  const { data, error } = await supabase
    .from("offer_not_included_items")
    .insert(rows)
    .select();

  if (error) throw error;
  return data;
}

export async function replaceOfferImages(
  offerId: string,
  images: string[]
) {
  const { error: deleteError } = await supabase
    .from("offer_images")
    .delete()
    .eq("offer_id", offerId);

  if (deleteError) throw deleteError;

  const cleanImages = images.filter((image) => image.trim() !== "");

  if (cleanImages.length === 0) return [];

  const rows = cleanImages.map((imageUrl) => ({
    offer_id: offerId,
    image_url: imageUrl,
  }));

  const { data, error } = await supabase
    .from("offer_images")
    .insert(rows)
    .select();

  if (error) throw error;
  return data;
}

export async function createCompleteOffer(payload: {
  offer: {
    destinationId: string;
    title: string;
    price: number;
    currency?: string;
    durationDays: number;
    durationNights: number;
    departureDate?: string;
    availablePlaces?: number;
    type?: string;
    description?: string;
    imageUrl?: string;
    isActive?: boolean;
  };
  program?: {
    dayNumber: number;
    title: string;
    description: string;
  }[];
  includedItems?: string[];
  notIncludedItems?: string[];
  images?: string[];
}) {
  const createdOffer = await createOffer(payload.offer);

  if (payload.program) {
    await replaceOfferProgram(createdOffer.id, payload.program);
  }

  if (payload.includedItems) {
    await replaceOfferIncludedItems(createdOffer.id, payload.includedItems);
  }

  if (payload.notIncludedItems) {
    await replaceOfferNotIncludedItems(createdOffer.id, payload.notIncludedItems);
  }

  if (payload.images) {
    await replaceOfferImages(createdOffer.id, payload.images);
  }

  return getOfferById(createdOffer.id);
}

export async function updateCompleteOffer(
  offerId: string,
  payload: {
    offer: {
      destinationId?: string;
      title?: string;
      price?: number;
      currency?: string;
      durationDays?: number;
      durationNights?: number;
      departureDate?: string;
      availablePlaces?: number;
      type?: string;
      description?: string;
      imageUrl?: string;
      isActive?: boolean;
    };
    program?: {
      dayNumber: number;
      title: string;
      description: string;
    }[];
    includedItems?: string[];
    notIncludedItems?: string[];
    images?: string[];
  }
) {
  await updateOffer(offerId, payload.offer);

  if (payload.program) {
    await replaceOfferProgram(offerId, payload.program);
  }

  if (payload.includedItems) {
    await replaceOfferIncludedItems(offerId, payload.includedItems);
  }

  if (payload.notIncludedItems) {
    await replaceOfferNotIncludedItems(offerId, payload.notIncludedItems);
  }

  if (payload.images) {
    await replaceOfferImages(offerId, payload.images);
  }

  return getOfferById(offerId);
}