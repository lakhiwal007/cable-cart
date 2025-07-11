import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchableSelect } from "@/components/ui/searchable-select";
import apiClient from "@/lib/apiClient";

interface DemandFormData {
  title: string;
  description: string;
  category: string;
  specifications: string;
  required_quantity: string;
  unit: string;
  location: string;
  delivery_deadline: string;
  additional_requirements: string;
  is_urgent: boolean;
  image_url?: string | string[];
}

interface MaterialCategory {
  id: string;
  name: string;
  image_url?: string;
}

interface DemandFormProps {
  onSubmit: (data: DemandFormData) => Promise<void>;
  categories: Array<{ value: string; label: string }>;
  materialCategories: MaterialCategory[];
  isAuthenticated: boolean;
  onCategoryAdded?: () => void;
}

const DemandForm = ({ onSubmit, categories, materialCategories, isAuthenticated, onCategoryAdded }: DemandFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DemandFormData & {
    rm?: string;
    type?: string;
    payment_terms?: string;
    whatsapp_number?: string;
  }>({
    ...{
    title: '',
    description: '',
    category: '',
    specifications: '',
    required_quantity: '',
    unit: 'kg',
    location: '',
    delivery_deadline: '',
    additional_requirements: '',
    is_urgent: false,
    image_url: '',
    },
    rm: '',
    type: '',
    payment_terms: '',
    whatsapp_number: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [addCategoryMode, setAddCategoryMode] = useState(false);
  const [newRM, setNewRM] = useState('');
  const [addRMMode, setAddRMMode] = useState(false);

  // Fallback categories for testing if none are loaded
  const fallbackCategories = [
    { value: "Copper Wire", label: "Copper Wire" },
    { value: "Aluminum Wire", label: "Aluminum Wire" },
    { value: "PVC Insulation", label: "PVC Insulation" },
    { value: "XLPE Insulation", label: "XLPE Insulation" },
    { value: "Rubber Insulation", label: "Rubber Insulation" },
  ];

  const categoriesToUse = categories.length > 0 ? categories : fallbackCategories;

  // RM options with fallback
  const rmOptions = [
    { value: "Cu", label: "Copper (Cu)" },
    { value: "Al", label: "Aluminum (Al)" },
    { value: "PVC", label: "PVC" },
    { value: "XLPE", label: "XLPE" },
    { value: "Rubber", label: "Rubber" },
    { value: "Steel", label: "Steel" },
    { value: "Brass", label: "Brass" },
    { value: "Fiber", label: "Fiber" },
  ];

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      setLoading(true);
      const cat = await apiClient.addMaterialCategory({ name: newCategory });
      setFormData((prev) => ({ ...prev, category: cat.name }));
      setAddCategoryMode(false);
      setNewCategory('');
      onCategoryAdded?.();
    } catch (err: any) {
      setError(err.message || 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value === "__add_new__") {
      setAddCategoryMode(true);
      setFormData((prev) => ({ ...prev, category: "" }));
    } else {
      setFormData((prev) => ({ ...prev, category: value }));
      setAddCategoryMode(false);
    }
  };

  const handleRMChange = (value: string) => {
    if (value === "__add_new__") {
      setAddRMMode(true);
      setFormData((prev) => ({ ...prev, rm: "" }));
    } else {
      setFormData((prev) => ({ ...prev, rm: value }));
      setAddRMMode(false);
    }
  };

  const handleAddRM = async () => {
    if (!newRM.trim()) return;
    try {
      setLoading(true);
      // Add the new RM to the options
      rmOptions.push({ value: newRM, label: newRM });
      setFormData((prev) => ({ ...prev, rm: newRM }));
      setAddRMMode(false);
      setNewRM('');
    } catch (err: any) {
      setError(err.message || 'Failed to add RM');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!formData.title || !formData.category || !formData.rm || !formData.required_quantity || !formData.location) {
      setError('Please fill all required fields.');
      return;
    }
    
    setLoading(true);
    try {
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        try {
          imageUrls = await Promise.all(
            imageFiles.map(file => apiClient.uploadListingImage(file))
          );
        } catch (uploadErr: any) {
          setError('Failed to upload one or more images: ' + (uploadErr.message || uploadErr));
          setLoading(false);
          return;
        }
      }
      await onSubmit({ ...formData, image_url: imageUrls });
      setSuccess('Demand posted successfully!');
      setFormData({
        title: '', description: '', category: '', specifications: '', required_quantity: '', unit: 'kg', location: '', delivery_deadline: '', additional_requirements: '', is_urgent: false, image_url: '',
        rm: '',
        type: '',
        payment_terms: '',
        whatsapp_number: '',
      });
      setImageFiles([]);
    } catch (err: any) {
      setError(err.message || 'Failed to post demand listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">Post Your Requirements</CardTitle>
        <CardDescription className="text-sm">Let suppliers know what materials you need</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-3 sm:px-6">
        {!isAuthenticated ? (
          <div className="text-center space-y-4">
            <div className="text-gray-500">You must be logged in to post a demand listing.</div>
            <Button onClick={() => navigate('/login')} className="bg-purple-600 hover:bg-purple-700">
              Login to Post Demand
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Choose RM *</label>
                <SearchableSelect
                  options={rmOptions}
                  value={formData.rm}
                  onValueChange={handleRMChange}
                  placeholder="Select RM"
                  searchPlaceholder="Search RM..."
                  emptyText="No RM found."
                  showAddNew={true}
                  onAddNew={() => setAddRMMode(true)}
                  disabled={loading}
                />
                {addRMMode && (
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    <Input value={newRM} onChange={e => setNewRM(e.target.value)} placeholder="New RM name" className="flex-1" />
                    <div className="flex gap-2">
                      <Button type="button" onClick={handleAddRM} disabled={loading} className="flex-1 sm:flex-none">Add</Button>
                      <Button type="button" variant="outline" onClick={() => setAddRMMode(false)} className="flex-1 sm:flex-none">Cancel</Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input name="title" value={formData.title} onChange={handleInput} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category *</label>
                {categoriesToUse.length === 0 ? (
                  <div className="text-sm text-gray-500">Loading categories...</div>
                ) : (
                  <SearchableSelect
                    options={categoriesToUse.filter(c => c.value !== 'all')}
                    value={formData.category}
                    onValueChange={handleCategoryChange}
                    placeholder="Select category"
                    searchPlaceholder="Search categories..."
                    emptyText="No categories found."
                    showAddNew={true}
                    onAddNew={() => setAddCategoryMode(true)}
                    disabled={loading}
                  />
                )}
                {addCategoryMode && (
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    <Input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="New category name" className="flex-1" />
                    <div className="flex gap-2">
                      <Button type="button" onClick={handleAddCategory} disabled={loading} className="flex-1 sm:flex-none">Add</Button>
                      <Button type="button" variant="outline" onClick={() => setAddCategoryMode(false)} className="flex-1 sm:flex-none">Cancel</Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Input name="type" value={formData.type} onChange={handleInput} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Specifications</label>
                <Input name="specifications" value={formData.specifications} onChange={handleInput} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Required Quantity *</label>
                <Input name="required_quantity" value={formData.required_quantity} onChange={handleInput} required type="number" min="0" step="any" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Unit</label>
                <select name="unit" value={formData.unit} onChange={handleInput} className="w-full border rounded h-10 px-2">
                  <option value="kg">kg</option>
                  <option value="mt">mt</option>
                  <option value="pieces">pieces</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location *</label>
                <Input name="location" value={formData.location} onChange={handleInput} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Delivery Deadline</label>
                <Input name="delivery_deadline" value={formData.delivery_deadline} onChange={handleInput} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Terms</label>
                <Input name="payment_terms" value={formData.payment_terms} onChange={handleInput} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Reference Image(s)</label>
                <Input type="file" accept="image/*" onChange={handleImageChange} multiple />
                {imageFiles.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-2">
                    {imageFiles.map((file, idx) => (
                      <img key={idx} src={URL.createObjectURL(file)} alt={`Preview ${idx + 1}`} className="h-24 rounded border object-contain" />
                    ))}
                  </div>
                )}
                {imageFiles.length > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    {imageFiles.map((file, idx) => file.name).join(', ')}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mt-6 col-span-1 sm:col-span-2 lg:col-span-3">
                <input type="checkbox" name="is_urgent" checked={formData.is_urgent} onChange={handleInput} />
                <label className="text-sm">Mark as urgent</label>
              </div>
              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium mb-1">Enter your WhatsApp no</label>
                <Input name="whatsapp_number" value={formData.whatsapp_number} onChange={handleInput} required type="tel" pattern="[0-9]{10,15}" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Requirements</label>
              <textarea name="additional_requirements" value={formData.additional_requirements} onChange={handleInput} rows={3} className="w-full border rounded p-2" />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Posting...' : 'Post Demand'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default DemandForm; 