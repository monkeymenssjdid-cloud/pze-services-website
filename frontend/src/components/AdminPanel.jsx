import React, { useState, useEffect } from 'react';
import { CheckCircle, X, Trash2, Loader2, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminPanel = () => {
  const [reviews, setReviews] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' or 'quotes'

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'reviews') {
        const response = await axios.get(`${API}/reviews/all`);
        setReviews(response.data);
      } else {
        const response = await axios.get(`${API}/quotes`);
        setQuotes(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveReview = async (reviewId) => {
    try {
      await axios.put(`${API}/reviews/${reviewId}/approve`);
      toast.success('Review approved successfully');
      fetchData();
    } catch (error) {
      console.error('Error approving review:', error);
      toast.error('Failed to approve review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await axios.delete(`${API}/reviews/${reviewId}`);
      toast.success('Review deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const handleUpdateQuoteStatus = async (quoteId, status) => {
    try {
      await axios.put(`${API}/quotes/${quoteId}/status?status=${status}`);
      toast.success(`Quote status updated to ${status}`);
      fetchData();
    } catch (error) {
      console.error('Error updating quote status:', error);
      toast.error('Failed to update quote status');
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section id="admin" className="py-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Admin Panel
            </h2>
            <p className="text-slate-600">Manage reviews and quote requests</p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm mb-6 p-2 flex gap-2">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'reviews'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Reviews Management
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'quotes'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Quote Requests
            </button>
          </div>

          {/* Refresh Button */}
          <div className="mb-4 flex justify-end">
            <Button
              onClick={fetchData}
              variant="outline"
              disabled={isLoading}
              className="border-slate-300"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : (
            <div className="space-y-4">
              {activeTab === 'reviews' && (
                <>
                  {reviews.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                      <p className="text-slate-600">No reviews to display</p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div
                        key={review.id}
                        className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900">
                              {review.name}
                            </h3>
                            {review.location && (
                              <p className="text-sm text-slate-600">{review.location}</p>
                            )}
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              review.approved
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {review.approved ? 'Approved' : 'Pending'}
                          </span>
                        </div>

                        <p className="text-slate-700 mb-4">"{review.review}"</p>

                        <div className="flex items-center gap-2">
                          {!review.approved && (
                            <Button
                              onClick={() => handleApproveReview(review.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                          )}
                          <Button
                            onClick={() => handleDeleteReview(review.id)}
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}

              {activeTab === 'quotes' && (
                <>
                  {quotes.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                      <p className="text-slate-600">No quote requests to display</p>
                    </div>
                  ) : (
                    quotes.map((quote) => (
                      <div
                        key={quote.id}
                        className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900">
                              {quote.name}
                            </h3>
                            <a
                              href={`tel:${quote.phone}`}
                              className="text-emerald-600 hover:text-emerald-700 font-medium"
                            >
                              {quote.phone}
                            </a>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                              quote.status
                            )}`}
                          >
                            {quote.status}
                          </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-slate-600">Service</p>
                            <p className="text-slate-900">
                              {quote.service}
                              {quote.custom_service && ` - ${quote.custom_service}`}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-600">Address</p>
                            <p className="text-slate-900">{quote.address}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-medium text-slate-600 mb-1">
                            Description
                          </p>
                          <p className="text-slate-700 bg-slate-50 p-3 rounded">
                            {quote.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          {quote.status !== 'contacted' && (
                            <Button
                              onClick={() => handleUpdateQuoteStatus(quote.id, 'contacted')}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Mark as Contacted
                            </Button>
                          )}
                          {quote.status !== 'completed' && (
                            <Button
                              onClick={() => handleUpdateQuoteStatus(quote.id, 'completed')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              Mark as Completed
                            </Button>
                          )}
                          {quote.status !== 'pending' && (
                            <Button
                              onClick={() => handleUpdateQuoteStatus(quote.id, 'pending')}
                              variant="outline"
                              className="border-slate-300"
                            >
                              Mark as Pending
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminPanel;