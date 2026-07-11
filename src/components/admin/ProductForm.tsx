'use client'

import { useState } from 'react'
import { createProduct } from '@/actions/products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CldUploadWidget } from 'next-cloudinary'
import { ImagePlus, X } from 'lucide-react'
import Image from 'next/image'

export function ProductForm({ categories }: { categories: any[] }) {
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    
    if (imageUrls.length === 0) {
      setError("Please upload at least one image.")
      setLoading(false)
      return
    }

    formData.append('imageUrls', JSON.stringify(imageUrls))
    // Switch state comes naturally through 'is_active' if we have a hidden input, 
    // but Shadcn switch doesn't emit native form data easily without hidden input.
    // So we handle it in the form.

    const result = await createProduct(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  const removeImage = (indexToRemove: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== indexToRemove))
  }

  return (
    <form action={handleSubmit} className="space-y-8 pb-10">
      
      {error && <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Basic Info & Images */}
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" name="name" required placeholder="e.g., Tomato F1 Hybrid" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category_id">Category *</Label>
                  <Select name="category_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input id="brand" name="brand" placeholder="e.g., Syngenta" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" className="min-h-[120px]" placeholder="Detailed product description..." />
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input id="price" name="price" type="number" step="0.01" required placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount (₹)</Label>
                <Input id="discount" name="discount" type="number" step="0.01" defaultValue="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Available Stock *</Label>
                <Input id="stock" name="stock" type="number" required placeholder="100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pack_size">Pack Size</Label>
                <Input id="pack_size" name="pack_size" placeholder="e.g., 10g, 500 seeds" />
              </div>
            </CardContent>
          </Card>

          {/* Product Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Agricultural Specifications</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="crop_type">Crop Type</Label>
                <Input id="crop_type" name="crop_type" placeholder="e.g., Vegetable" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seed_variety">Seed Variety</Label>
                <Input id="seed_variety" name="seed_variety" placeholder="e.g., Roma" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hybrid_open_pollinated">Seed Type</Label>
                <Select name="hybrid_open_pollinated" defaultValue="Hybrid">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Open Pollinated">Open Pollinated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="season">Suitable Season</Label>
                <Input id="season" name="season" placeholder="e.g., Rabi, Kharif, All Season" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maturity_duration">Maturity Duration</Label>
                <Input id="maturity_duration" name="maturity_duration" placeholder="e.g., 60-70 Days" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disease_resistance">Disease Resistance</Label>
                <Input id="disease_resistance" name="disease_resistance" placeholder="e.g., ToLCV, Early Blight" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Images, Extra Info & Status */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {imageUrls.map((url, i) => (
                  <div key={i} className="relative h-24 w-full overflow-hidden rounded-md border border-zinc-200">
                    <Image src={url} alt={`Preview ${i}`} fill className="object-cover" />
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="icon" 
                      className="absolute right-1 top-1 h-6 w-6"
                      onClick={() => removeImage(i)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <CldUploadWidget 
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={(result: any) => {
                  setImageUrls(prev => [...prev, result.info.secure_url])
                }}
              >
                {({ open }) => (
                  <div 
                    onClick={() => open()} 
                    className="flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100 transition-colors"
                  >
                    <ImagePlus className="h-6 w-6 text-zinc-400" />
                    <span className="text-xs font-medium text-zinc-600">Upload Image</span>
                  </div>
                )}
              </CldUploadWidget>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="yield_info">Yield Information</Label>
                <Textarea id="yield_info" name="yield_info" placeholder="Expected yield per acre..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sowing_time">Sowing Time</Label>
                <Input id="sowing_time" name="sowing_time" placeholder="Best months to sow..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storage_instructions">Storage Instructions</Label>
                <Input id="storage_instructions" name="storage_instructions" placeholder="e.g., Store in a cool, dry place" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Active Status</Label>
                  <p className="text-sm text-zinc-500">Make this product visible in the store.</p>
                </div>
                <Switch defaultChecked name="_is_active_dummy" onCheckedChange={(c) => {
                  const el = document.getElementById('is_active_hidden') as HTMLInputElement
                  if (el) el.value = c.toString()
                }} />
                <input type="hidden" id="is_active_hidden" name="is_active" value="true" />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={loading} size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg">
            {loading ? 'Publishing Product...' : 'Publish Product'}
          </Button>
        </div>
      </div>
    </form>
  )
}
