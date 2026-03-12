import React, { useState, useEffect } from 'react';
import { Star, MapPin, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    review: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch approved reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Fallback to empty array if fetch fails
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.review) {
      toast.error('Please fill in your name and review');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`${API}/reviews`, {
        name: formData.name,
        location: formData.location || null,
        review: formData.review
      });

      toast.success('Thank you! Your review has been submitted and is pending approval.');
      
      // Reset form
      setFormData({
        name: '',
        location: '',
        review: ''
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.detail || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
        }`}
      />
    ));
  };

  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Customer Reviews
            </h2>
            <p className="text-lg text-slate-600">
              We appreciate honest feedback from our customers. Reviews will appear here once they are submitted and approved.
            </p>
          </div>

          {/* Reviews Display */}
          <div className="mb-16">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              </div>
            ) : reviews.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => (
                  <div 
                    key={review.id}
                    className="bg-slate-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-200"
                  >
                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      {renderStars(review.rating)}
                    </div>

                    {/* Review Text */}
                    <p className="text-slate-700 mb-4 leading-relaxed">
                      "{review.review}"
                    </p>

                    {/* Reviewer Info */}
                    <div className="border-t border-slate-200 pt-4">
                      <p className="font-semibold text-slate-900">{review.name}</p>
                      {review.location && (
                        <div className="flex items-center text-sm text-slate-600 mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {review.location}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl p-12 text-center border border-slate-200">
                <p className="text-slate-600 text-lg mb-2">
                  No reviews yet — be the first to leave one.
                </p>
              </div>
            )}
          </div>

          {/* Review Form */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Leave a Review
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                Reviews are shown only after approval.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <Label htmlFor="reviewName" className="text-slate-700 font-medium mb-2 block">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="reviewName"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    required
                    className="bg-white border-slate-300 focus:border-emerald-500"
                  />
                </div>

                {/* Location (Optional) */}
                <div>
                  <Label htmlFor="location" className="text-slate-700 font-medium mb-2 block">
                    City or Area (Optional)
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Taft, CA"
                    className="bg-white border-slate-300 focus:border-emerald-500"
                  />
                </div>

                {/* Review */}
                <div>
                  <Label htmlFor="reviewText" className="text-slate-700 font-medium mb-2 block">
                    Review <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="reviewText"
                    name="review"
                    value={formData.review}
                    onChange={handleInputChange}
                    placeholder="Share your experience with PZE services"
                    rows={5}
                    required
                    className="bg-white border-slate-300 focus:border-emerald-500"
                  />
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
                    'Submit Review'
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
