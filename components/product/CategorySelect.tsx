import { useState } from "react";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { createClient } from "@/utils/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CategoryModal } from "./CategoryModal";

interface CategorySelectProps {
  value?: string;
  onChange: (value: string) => void;
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();

  const { data: categories, isLoading } = useQuery(
    supabase.from("categories").select("*").order("name"),
  );

  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <SelectItem value="loading" disabled>
              Loading categories...
            </SelectItem>
          ) : (
            categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      <Button
        type="button"
        variant="outline"
        onClick={() => setIsModalOpen(true)}
      >
        Create New Category
      </Button>

      <CategoryModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
