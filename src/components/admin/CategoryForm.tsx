'use client'

import { useState } from 'react'
import { createCategory } from '@/actions/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CldUploadWidget } from 'next-cloudinary'
import { ImagePlus, X } from 'lucide-react'
import Image from 'next/image'

export function CategoryForm({ onSuccess }: { onSuccess?: () => void }) {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    formData.append('imageUrl', imageUrl)
    
    const result = await createCategory(formData)
    
    if (result.success && onSuccess) {
      onSuccess()
    } else if (result.error) {
      alert(result.error)
    }
    
    setLoading(false)
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input id="name" name="name" required placeholder="e.g., Summer Vegetables" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" name="description" placeholder="A short description..." />
      </div>
      
      <div className="space-y-2">
        <Label>Category Image</Label>
        {imageUrl ? (
          <div className="relative h-40 w-full overflow-hidden rounded-md border border-zinc-200">
            <Image src={imageUrl} alt="Uploaded preview" fill className="object-cover" />
            <Button 
              type="button" 
              variant="destructive" 
              size="icon" 
              className="absolute right-2 top-2 h-8 w-8"
              onClick={() => setImageUrl('')}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <CldUploadWidget 
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onSuccess={(result: any) => {
              setImageUrl(result.info.secure_url)
            }}
          >
            {({ open }) => {
              return (
                <div 
                  onClick={() => open()} 
                  className="flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100 transition-colors"
                >
                  <ImagePlus className="h-8 w-8 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-600">Click to upload image</span>
                </div>
              );
            }}
          </CldUploadWidget>
        )}
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white">
        {loading ? 'Creating...' : 'Create Category'}
      </Button>
    </form>
  )
}
