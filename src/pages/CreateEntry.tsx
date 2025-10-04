/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Save } from 'lucide-react';
import CustomButton from '../components/CustomButton';

import { createKnowledgeEntry } from '../store/thunk';
import type { AppDispatch, RootState } from '../store/store';

interface FormData {
  title: string;
  description: string;
  category: string;
  status: 'certified' | 'training';
  techName: string;
  prodTime: string;
}

const CreateKnowledgeEntry: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { createLoading, createError } = useSelector((state: RootState) => state.knowledge);
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
     
      const entryData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        status: formData.status,
        techName: formData.techName,
        prodTime: `${formData.prodTime} min read`,
      };

      console.log('Submitting entry:', entryData);
      
      // Dispatch the create action
      const result = await dispatch(createKnowledgeEntry(entryData)).unwrap();
      
      console.log('Entry created successfully:', result);
      
      // Redirect back to dashboard after successful creation
      navigate('/');
      
    } catch (error) {
      console.error('Error creating entry:', error);
      // Error is already handled by Redux and will be in createError state
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview (this is just for UI, we won't save the file)
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

 

  return(
    <>
  
    <div className="min-h-screen bg-[#F8FAFC] p-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h1 className="text-[32px] font-semibold text-[#1A202C] leading-[38px] tracking-[-0.02em] mb-2">
                Create New Entry
              </h1>
              <p className="text-[#718096] text-[16px] leading-[24px]">
                Add a new knowledge entry to your base
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

        {/* Show error message if creation failed */}
        {createError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[8px]">
            <p className="text-red-700 text-[14px] leading-[20px]">
              Error: {createError}
            </p>
          </div>
        )}

        {/* Form Container */}
     <div className="bg-white rounded-[12px] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)] border border-[#E2E8F0] overflow-hidden max-w-3xl mx-auto">
          <div className="p-[24px] border-b border-[#E2E8F0]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[16px]">
              <h2 className="text-[18px] font-semibold text-[#1A202C] leading-[28px]">
                Entry Details
                <span className="text-[#718096] font-normal ml-[8px]">(all fields required)</span>
              </h2>
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
                  disabled={createLoading}
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
                  disabled={createLoading}
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
                    disabled={createLoading}
                  >
                    <option value="Auto-Mobiles">Auto-Mobiles</option>
                    <option value="Lathe">Lathe</option>
                 
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
                    disabled={createLoading}
                  >
                    <option value="certified">certified</option>
                    <option value="training">training</option>
                  </select>
                </div>
              </div>

              {/* techName and Prod Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] w-full">
                <div>
                  <label className="block text-[14px] font-medium text-[#1A202C] leading-[20px] mb-[8px]">
                    Technician Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.techName}
                    onChange={(e) => setFormData({ ...formData, techName: e.target.value })}
                    className="w-full px-[16px] py-[12px] border border-[#E2E8F0] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#3182CE] focus:border-transparent text-[14px] leading-[20px] placeholder-[#A0AEC0]"
                    placeholder="Enter Technician Name..."
                    disabled={createLoading}
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-medium text-[#1A202C] leading-[20px] mb-[8px]">
                    Prod Time *
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
                      disabled={createLoading}
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
                    disabled={createLoading}
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
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-[12px] pt-[24px] border-t border-[#F7FAFC] w-full">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex items-center justify-center gap-[10px] border border-[#E2E8F0] hover:bg-[#F7FAFC] text-[#4A5568] px-[20px] py-[12px] rounded-[8px] font-medium text-[14px] leading-[20px] transition-all duration-200 w-full sm:w-auto"
                  disabled={createLoading}
                >
                  Cancel
                </button>
                <CustomButton
                  label={createLoading ? "Creating Entry..." : "Create Entry"}
                  icon={createLoading ? undefined : <Save size={20} />}
                  type="submit"
                  disabled={createLoading}
                  className={createLoading ? "opacity-50 cursor-not-allowed" : ""}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
);
};

export default CreateKnowledgeEntry;