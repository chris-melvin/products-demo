import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";

export type UploadImageResponse = {
  path: string;
  error: Error | null;
};

export const deleteProductImage = async (
  path: string,
): Promise<{ error: Error | null }> => {
  const supabase = createClient();

  try {
    const { error: deleteError } = await supabase.storage
      .from("product-images")
      .remove([path]);

    if (deleteError) {
      throw deleteError;
    }

    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const getPublicUrl = (path: string): string => {
  const supabase = createClient();

  const { data } = supabase.storage.from("product-images").getPublicUrl(path);

  return data.publicUrl;
};
