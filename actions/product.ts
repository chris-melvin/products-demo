"use server";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";

const STORAGE_BUCKET = "product-images";

export const createProductAction = async (formData: FormData) => {
  const supabase = await createClient();

  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const base_price = parseFloat(formData.get("base_price") as string);
    const category_id = formData.get("category_id") as string;
    const image = formData.get("image") as File | null;

    if (!name || !description || isNaN(base_price)) {
      return encodedRedirect(
        "error",
        "/dashboard/products/create",
        "All required fields must be provided",
      );
    }

    // Handle image upload if provided
    let storage_path = null;
    if (image && image.size > 0) {
      const fileExt = image.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Convert File to ArrayBuffer for Supabase Storage
      const arrayBuffer = await image.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, arrayBuffer, {
          contentType: image.type,
          cacheControl: "3600",
        });

      if (uploadError) {
        return encodedRedirect(
          "error",
          "/dashboard/products/create",
          "Failed to upload image",
        );
      }

      storage_path = filePath;
    }

    // Create product
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        name,
        description,
        base_price,
        category_id: category_id || null,
      })
      .select()
      .single();

    if (productError) {
      // Clean up uploaded image if product creation fails
      if (storage_path) {
        await supabase.storage.from(STORAGE_BUCKET).remove([storage_path]);
      }
      return encodedRedirect(
        "error",
        "/dashboard/products/create",
        "Failed to create product",
      );
    }

    // Create image record if we have an image
    if (storage_path) {
      const { error: imageError } = await supabase
        .from("product_images")
        .insert({
          product_id: product.id,
          storage_path,
          is_primary: true,
        });

      if (imageError) {
        // Clean up uploaded image if record creation fails
        await supabase.storage.from(STORAGE_BUCKET).remove([storage_path]);
        return encodedRedirect(
          "error",
          "/dashboard/products/create",
          "Failed to save image reference",
        );
      }
    }
  } catch (error) {
    return encodedRedirect(
      "error",
      "/dashboard/products/create",
      "An unexpected error occurred",
    );
  }
};

export const updateProductAction = async ({
  id,
  data,
}: {
  id: string;
  data: FormData;
}) => {
  const supabase = await createClient();

  try {
    const name = data.get("name") as string;
    const description = data.get("description") as string;
    const base_price = parseFloat(data.get("base_price") as string);
    const category_id = data.get("category_id") as string;
    const image = data.get("image") as File | null;
    if (!id || !name || !description || isNaN(base_price)) {
      return encodedRedirect(
        "error",
        `/dashboard/products/edit/${id}`,
        "All required fields must be provided",
      );
    }

    // Handle image upload if new image is provided
    let storage_path = null;
    if (image && image.size > 0) {
      // Delete existing image if any
      const { data: existingImage } = await supabase
        .from("product_images")
        .select("storage_path")
        .eq("product_id", id)
        .eq("is_primary", true)
        .single();

      if (existingImage) {
        await supabase.storage
          .from("products")
          .remove([existingImage.storage_path]);
      }

      // Upload new image
      const fileExt = image.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Convert File to ArrayBuffer for Supabase Storage
      const arrayBuffer = await image.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, arrayBuffer, {
          contentType: image.type,
          cacheControl: "3600",
        });

      if (uploadError) {
        return encodedRedirect(
          "error",
          `/dashboard/products/edit/${id}`,
          "Failed to upload new image",
        );
      }

      storage_path = filePath;
    }

    // Update product
    const { error: productError } = await supabase
      .from("products")
      .update({
        name,
        description,
        base_price,
        category_id: category_id || null,
      })
      .eq("id", id);

    if (productError) {
      return encodedRedirect(
        "error",
        `/dashboard/products/edit/${id}`,
        "Failed to update product",
      );
    }

    // Update image record if we have a new image
    if (storage_path) {
      const { error: imageError } = await supabase
        .from("product_images")
        .upsert(
          {
            product_id: id,
            storage_path,
            is_primary: true,
          },
          {
            onConflict: "product_id,is_primary",
          },
        );

      if (imageError) {
        return encodedRedirect(
          "error",
          `"/dashboard/products/edit/${id}`,
          "Failed to update image reference",
        );
      }
    }
  } catch (error) {
    return encodedRedirect(
      "error",
      `/dashboard/products/edit/${id}`,
      "An unexpected error occurred",
    );
  }
};

export const createCategoryAction = async (formData: FormData) => {
  const supabase = await createClient();

  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!name) {
      return { error: "Category name is required" };
    }

    const { data: category, error } = await supabase
      .from("categories")
      .insert({
        name,
        description,
      })
      .select()
      .single();

    if (error) {
      return { error: "Failed to create category" };
    }

    return { data: category };
  } catch (error) {
    return { error: "An unexpected error occurred" };
  }
};

export const deleteProductAction = async (formData: FormData) => {
  const supabase = await createClient();

  try {
    const id = formData.get("id") as string;

    if (!id) {
      return encodedRedirect(
        "error",
        "/dashboard/products",
        "Product ID is required",
      );
    }

    // Get product images
    const { data: images } = await supabase
      .from(STORAGE_BUCKET)
      .select("storage_path")
      .eq("product_id", id);

    // Delete images from storage
    if (images && images.length > 0) {
      const paths = images.map((img) => img.storage_path);
      await supabase.storage.from("products").remove(paths);
    }

    // Delete product (will cascade delete images references)
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      return encodedRedirect(
        "error",
        "/dashboard/products",
        "Failed to delete product",
      );
    }
  } catch (error) {
    return encodedRedirect(
      "error",
      "/dashboard/products",
      "An unexpected error occurred",
    );
  }
};
