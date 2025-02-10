// components/forms/CategorySelect.tsx
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/utils/supabase/client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { CategoryModal } from "./CategoryModal"

interface Category {
  id: string
  name: string
  description: string | null
}

interface CategorySelectProps {
  value?: string
  onChange: (value: string) => void
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const supabase = createClient()

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      
      if (error) throw error
      return data as Category[]
    }
  })

  if (isLoading) {
    return <div>Loading categories...</div>
  }

  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories?.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        type="button"
        variant="outline"
        onClick={() => setIsModalOpen(true)}
      >
        Create New Category
      </Button>

      <CategoryModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  )
}