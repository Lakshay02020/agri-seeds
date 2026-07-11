'use client'

import { useState } from 'react'
import { createProduct, updateProduct } from '@/actions/products'

export function ProductForm({ categories, initialData }: { categories: any[], initialData?: any }) {
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialData?.product_images?.map((img: any) => img.image_url) || []
  )
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

    let result
    if (initialData?.id) {
      result = await updateProduct(initialData.id, formData)
    } else {
      result = await createProduct(formData)
    }
    
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
                <Input id="name" name="name" required placeholder="e.g., Tomato F1 Hybrid" defaultValue={initialData?.name} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category_id">Category *</Label>
                  <Select name="category_id" required defaultValue={initialData?.category_id}>
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
                  <Input id="brand" name="brand" placeholder="e.g., Syngenta" defaultValue={initialData?.brand} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" className="min-h-[120px]" placeholder="Detailed product description..." defaultValue={initialData?.description} />
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
                <Input id="price" name="price" type="number" step="0.01" required placeholder="0.00" defaultValue={initialData?.price} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount (₹)</Label>
                <Input id="discount" name="discount" type="number" step="0.01" defaultValue={initialData?.discount || "0"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Available Stock *</Label>
                <Input id="stock" name="stock" type="number" required placeholder="100" defaultValue={initialData?.stock} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pack_size">Pack Size</Label>
                <Input id="pack_size" name="pack_size" placeholder="e.g., 10g, 500 seeds" defaultValue={initialData?.pack_size} />
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
                <Input id="crop_type" name="crop_type" placeholder="e.g., Vegetable" defaultValue={initialData?.crop_type} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seed_variety">Seed Variety</Label>
                <Input id="seed_variety" name="seed_variety" placeholder="e.g., Roma" defaultValue={initialData?.seed_variety} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hybrid_open_pollinated">Seed Type</Label>
                <Select name="hybrid_open_pollinated" defaultValue={initialData?.hybrid_open_pollinated || "Hybrid"}>
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
                <Input id="season" name="season" placeholder="e.g., Rabi, Kharif, All Season" defaultValue={initialData?.season} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maturity_duration">Maturity Duration</Label>
                <Input id="maturity_duration" name="maturity_duration" placeholder="e.g., 60-70 Days" defaultValue={initialData?.maturity_duration} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disease_resistance">Disease Resistance</Label>
                <Input id="disease_resistance" name="disease_resistance" placeholder="e.g., ToLCV, Early Blight" defaultValue={initialData?.disease_resistance} />
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
                <Textarea id="yield_info" name="yield_info" placeholder="Expected yield per acre..." defaultValue={initialData?.yield_info} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sowing_time">Sowing Time</Label>
                <Input id="sowing_time" name="sowing_time" placeholder="Best months to sow..." defaultValue={initialData?.sowing_time} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storage_instructions">Storage Instructions</Label>
                <Input id="storage_instructions" name="storage_instructions" placeholder="e.g., Store in a cool, dry place" defaultValue={initialData?.storage_instructions} />
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
                <Switch defaultChecked={initialData ? initialData.is_active : true} name="_is_active_dummy" onCheckedChange={(c) => {
                  const el = document.getElementById('is_active_hidden') as HTMLInputElement
                  if (el) el.value = c.toString()
                }} />
                <input type="hidden" id="is_active_hidden" name="is_active" value={initialData ? initialData.is_active.toString() : "true"} />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={loading} size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg">
            {loading ? (initialData ? 'Updating Product...' : 'Publishing Product...') : (initialData ? 'Update Product' : 'Publish Product')}
          </Button>
        </div>
      </div>
    </form>
  )
}
