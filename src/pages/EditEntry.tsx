import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, Save } from 'lucide-react';
import CustomButton from '../components/CustomButton';

import type { AppDispatch, RootState } from '../store/store';
import { updateKnowledgeEntry } from '../store/thunk';

interface FormData {
  title: string;
  description: string;
  category: string;
  status: 'certified' | 'training';
  techName: string;
  prodTime: string;
}

const EditEntry: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const { entries, updateLoading, updateError } = useSelector((state: RootState) => state.knowledge);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: 'Development',
    status: 'certified',
    techName: '',
    prodTime: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Find the entry to edit when component mounts or id changes
  useEffect(() => {
    if (id && entries) {
      const entryToEdit = entries.find(entry => entry.id === id);
      if (entryToEdit) {
        // Extract read time number from "X min read" string
        const prodTimeMatch = entryToEdit.prodTime?.match(/(\d+)/);
        const prodTime = prodTimeMatch ? prodTimeMatch[1] : '';
        
        setFormData({
          title: entryToEdit.title || '',
          description: entryToEdit.description || '',
          category: entryToEdit.category || 'Development',
          status: entryToEdit.status || 'certified',
          techName: entryToEdit.techName || '',
          prodTime: prodTime,
        });

        // Set image preview if exists
        // if (entryToEdit.imageUrl) {
        //   setImagePreview(entryToEdit.imageUrl);
        // }
      }
    }
  }, [id, entries]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!id) {
    console.error('No entry ID found');
    return;
  }
  
  try {
    // Prepare the data for update in the correct structure
    const entryData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      status: formData.status,
      techName: formData.techName,
      prodTime: `${formData.prodTime} min read`,
      // Add image file if a new one was selected
      ...(imageFile && { imageFile })
    };

    console.log('Dispatching update with data:', { id, entryData });
    
    // Dispatch the update action with correct structure
    const result = await dispatch(updateKnowledgeEntry({ 
      id, 
      entryData 
    })).unwrap();
    
    console.log('Entry updated successfully:', result);
    
    // Redirect back to dashboard after successful update
    navigate('/');
    
  } catch (error) {
    console.error('Error updating entry:', error);
    // Error is already handled by Redux and will be in updateError state
  }
};

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Show loading state if entry data is not yet loaded
  if (!id || !entries) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3182CE] mx-auto"></div>
          <p className="mt-4 text-[#718096]">Loading entry data...</p>
        </div>
      </div>
    );
  }

  const entryToEdit = entries.find(entry => entry.id === id);
  
  // Show error if entry not found
  if (!entryToEdit) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#1A202C] mb-4">
              Entry Not Found
            </h1>
            <p className="text-[#718096] mb-6">
              The entry you're trying to edit doesn't exist.
            </p>
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-[10px] border border-[#E2E8F0] hover:bg-[#F7FAFC] text-[#4A5568] px-[20px] py-[12px] rounded-[8px] font-medium text-[14px] leading-[20px] transition-all duration-200 mx-auto"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h1 className="text-[32px] font-semibold text-[#1A202C] leading-[38px] tracking-[-0.02em] mb-2">
                Edit Entry
              </h1>
              <p className="text-[#718096] text-[16px] leading-[24px]">
                Update the knowledge entry: <span className="font-medium">{entryToEdit.title}</span>
              </p>
            </div>
            
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-[10px] border border-[#E2E8F0] hover:bg-[#F7FAFC] text-[#4A5568] px-[20px] py-[12px] rounded-[8px] font-medium text-[14px] leading-[20px] transition-all duration-200 w-full lg:w-auto"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Show error message if update failed */}
        {updateError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[8px] max-w-3xl mx-auto">
            <p className="text-red-700 text-[14px] leading-[20px]">
              Error updating entry: {updateError}
            </p>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-[12px] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)] border border-[#E2E8F0] overflow-hidden max-w-3xl mx-auto">
          <div className="p-[24px] border-b border-[#E2E8F0]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[16px]">
              <h2 className="text-[18px] font-semibold text-[#1A202C] leading-[28px]">
                Edit Entry Details
                <span className="text-[#718096] font-normal ml-[8px]">(all fields required)</span>
              </h2>
              <div className="text-[12px] text-[#718096] bg-[#F7FAFC] px-[8px] py-[4px] rounded-[4px]">
                ID: {id}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-[24px]">
            {/* Form content in a centered container */}
            <div className="max-w-2xl mx-auto space-y-[24px]">
              {/* Title */}
              <div className="w-full">
                <label className="block text-[14px] font-medium text-[#1A202C] leading-[20px] mb-[8px]">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-[16px] py-[12px] border border-[#E2E8F0] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#3182CE] focus:border-transparent text-[14px] leading-[20px] placeholder-[#A0AEC0]"
                  placeholder="Enter a descriptive title for your knowledge entry..."
                  disabled={updateLoading}
                />
              </div>

              {/* Description */}
              <div className="w-full">
                <label className="block text-[14px] font-medium text-[#1A202C] leading-[20px] mb-[8px]">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-[16px] py-[12px] border border-[#E2E8F0] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#3182CE] focus:border-transparent text-[14px] leading-[20px] placeholder-[#A0AEC0] resize-none"
                  placeholder="Provide a detailed description of the knowledge entry..."
                  disabled={updateLoading}
                />
              </div>

              {/* Category and Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] w-full">
                <div>
                  <label className="block text-[14px] font-medium text-[#1A202C] leading-[20px] mb-[8px]">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-[16px] py-[12px] border border-[#E2E8F0] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#3182CE] focus:border-transparent text-[14px] leading-[20px] text-[#1A202C] bg-white"
                    disabled={updateLoading}
                  >
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Backend">Backend</option>
                    <option value="Frontend">Frontend</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Database">Database</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[14px] font-medium text-[#1A202C] leading-[20px] mb-[8px]">
                    Status *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'certified' | 'training' })}
                    className="w-full px-[16px] py-[12px] border border-[#E2E8F0] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#3182CE] focus:border-transparent text-[14px] leading-[20px] text-[#1A202C] bg-white"
                    disabled={updateLoading}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              {/* techName and Read Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] w-full">
                <div>
                  <label className="block text-[14px] font-medium text-[#1A202C] leading-[20px] mb-[8px]">
                    techName *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.techName}
                    onChange={(e) => setFormData({ ...formData, techName: e.target.value })}
                    className="w-full px-[16px] py-[12px] border border-[#E2E8F0] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#3182CE] focus:border-transparent text-[14px] leading-[20px] placeholder-[#A0AEC0]"
                    placeholder="Enter techName name..."
                    disabled={updateLoading}
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-medium text-[#1A202C] leading-[20px] mb-[8px]">
                    Read Time *
                  </label>
                  <div className="flex gap-[12px]">
                    <input
                      type="number"
                      min="1"
                      max="120"
                      required
                      value={formData.prodTime}
                      onChange={(e) => setFormData({ ...formData, prodTime: e.target.value })}
                      className="flex-1 px-[16px] py-[12px] border border-[#E2E8F0] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#3182CE] focus:border-transparent text-[14px] leading-[20px] placeholder-[#A0AEC0]"
                      placeholder="5"
                      disabled={updateLoading}
                    />
                    <span className="flex items-center px-[16px] bg-[#F7FAFC] border border-[#E2E8F0] rounded-[8px] text-[#718096] text-[14px] leading-[20px]">
                      minutes
                    </span>
                  </div>
                  <p className="text-[#718096] text-[12px] leading-[16px] mt-[8px]">
                    Estimated reading time
                  </p>
                </div>
              </div>

              {/* Cover Image */}
              <div className="w-full">
                <label className="block text-[14px] font-medium text-[#1A202C] leading-[20px] mb-[8px]">
                  Cover Image (Optional - for preview only)
                </label>
                <div className="border-2 border-dashed border-[#E2E8F0] rounded-[8px] p-[16px] text-center hover:border-[#A0AEC0] transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                    disabled={updateLoading}
                  />
                  <label htmlFor="image-upload" className="cursor-pointer block">
                    <Upload className="mx-auto text-[#A0AEC0] mb-[8px]" size={20} />
                    <div className="text-[13px] text-[#718096] leading-[18px]">
                      <span className="text-[#3182CE] hover:text-[#2C5AA0] font-medium">
                        Click to upload
                      </span>
                      <span className="text-[#718096]"> or drag and drop</span>
                    </div>
                    <p className="text-[#718096] text-[11px] leading-[14px] mt-[6px]">
                      PNG, JPG, GIF up to 10MB (preview only)
                    </p>
                  </label>
                </div>
                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-[12px] text-[#718096] mb-2">Current Preview:</p>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-48 rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-[12px] pt-[24px] border-t border-[#F7FAFC] w-full">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex items-center justify-center gap-[10px] border border-[#E2E8F0] hover:bg-[#F7FAFC] text-[#4A5568] px-[20px] py-[12px] rounded-[8px] font-medium text-[14px] leading-[20px] transition-all duration-200 w-full sm:w-auto"
                  disabled={updateLoading}
                >
                  Cancel
                </button>
                <CustomButton
                  label={updateLoading ? "Updating Entry..." : "Update Entry"}
                  icon={updateLoading ? undefined : <Save size={20} />}
                  type="submit"
                  disabled={updateLoading}
                  className={updateLoading ? "opacity-50 cursor-not-allowed" : ""}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEntry;