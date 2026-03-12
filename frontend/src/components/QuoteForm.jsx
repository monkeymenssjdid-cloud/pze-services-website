import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { serviceOptions } from '../mockData';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const QuoteForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    address: '',
    description: '',
    customService: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (value) => {
    setFormData(prev => ({ ...prev, service: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      toast.success(`File "${file.name}" selected`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.phone || !formData.service || !formData.address || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.service === 'Custom' && !formData.customService) {
      toast.error('Please describe your custom service need');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare form data for multipart/form-data
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('phone', formData.phone);
      submitData.append('service', formData.service);
      submitData.append('address', formData.address);
      submitData.append('description', formData.description);
      
      if (formData.customService) {
        submitData.append('custom_service', formData.customService);
      }
      
      if (selectedFile) {
        submitData.append('photo', selectedFile);
      }

      // Submit to backend API
      await axios.post(`${API}/quotes`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Quote request submitted successfully! We will contact you soon.');
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        service: '',
        address: '',
        description: '',
        customService: ''
      });
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('photo');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast.error(error.response?.data?.detail || 'Failed to submit quote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="quote" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Get a Quote
            </h2>
            <p className="text-lg text-slate-600">
              Need a quote? Fill out the form below and send us your information. We will review your request and contact you as soon as possible.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            {/* Name */}
            <div>
              <Label htmlFor="name" className="text-slate-700 font-medium mb-2 block">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your full name"
                required
                className="border-slate-300 focus:border-emerald-500"
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone" className="text-slate-700 font-medium mb-2 block">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(555) 123-4567"
                required
                className="border-slate-300 focus:border-emerald-500"
              />
            </div>

            {/* Service Needed */}
            <div>
              <Label htmlFor="service" className="text-slate-700 font-medium mb-2 block">
                Service Needed <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.service} onValueChange={handleServiceChange} required>
                <SelectTrigger className="border-slate-300 focus:border-emerald-500">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {serviceOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom Service Description */}
            {formData.service === 'Custom' && (
              <div>
                <Label htmlFor="customService" className="text-slate-700 font-medium mb-2 block">
                  Custom Service Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="customService"
                  name="customService"
                  value={formData.customService}
                  onChange={handleInputChange}
                  placeholder="Please describe the custom job you need help with"
                  rows={3}
                  required
                  className="border-slate-300 focus:border-emerald-500"
                />
              </div>
            )}

            {/* Job Address */}
            <div>
              <Label htmlFor="address" className="text-slate-700 font-medium mb-2 block">
                Job Address or Area <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street address, city, and ZIP"
                required
                className="border-slate-300 focus:border-emerald-500"
              />
            </div>

            {/* Job Description */}
            <div>
              <Label htmlFor="description" className="text-slate-700 font-medium mb-2 block">
                Short Job Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide details about the job, including size, scope, and any special requirements"
                rows={4}
                required
                className="border-slate-300 focus:border-emerald-500"
              />
            </div>

            {/* Photo Upload */}
            <div>
              <Label htmlFor="photo" className="text-slate-700 font-medium mb-2 block">
                Optional Photo Upload
              </Label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-emerald-500 transition-colors">
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label 
                  htmlFor="photo"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="w-10 h-10 text-slate-400 mb-2" />
                  <span className="text-sm text-slate-600 mb-1">
                    {selectedFile ? selectedFile.name : 'Click to upload a photo'}
                  </span>
                  <span className="text-xs text-slate-500">
                    PNG, JPG up to 5MB
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Quote Request'
              )}
            </Button>

            <p className="text-sm text-slate-500 text-center mt-4">
              We typically respond within 24 hours during business days
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default QuoteForm;
