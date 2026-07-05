import React, { useContext, useEffect, useState } from 'react';
import { Search, Plus, Star, X, Trash2 } from 'lucide-react';
import BottomNav from './Home/BottomNav';
import { useForm } from 'react-hook-form';
import api from '../../API/CustomApi';
import { Config } from '../../API/Config';
import { AuthContext } from '../Context/AuthContext';
import Loader from './Home/Loader';

function Reviews() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showAddReview, setShowAddReview] = useState(false);
    const { handleSubmit, register } = useForm();
    const { user, setUser } = useContext(AuthContext);
    const [reviews, setReviews] = useState([]);
    const [allReviews, setAllReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            setIsLoading(true)
            try {
                const response = await api.get(Config.GETREVIEWSUrl);
                if (response.data) {
                    const fetchedReviews = response.data.reviews || [];
                    setReviews(fetchedReviews);
                    setAllReviews(fetchedReviews);
                    setIsLoading(false)
                }
            } catch (error) {
                console.error('An error occurred while fetching reviews:', error);
                setIsLoading(false)
            } finally {
                setIsLoading(false)
            }
        };
        fetchReviews();
    }, []);


    const handleSubmitReview = async (data) => {
        setIsLoading(true);
        try {
            const response = await api.post(Config.ADDREVIEWUrl, {
                location: data.location,
                title: data.title,
                review: data.review,
                userId: user._id,
            });
            if (response.status === 201) {
                const { review: newReview } = response.data;
                setReviews((prev) => [newReview, ...prev]);
                setAllReviews((prev) => [newReview, ...prev]);
                setShowAddReview(false);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setIsLoading(false);
        }
    };



    const handleSearch = (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (!searchQuery.trim()) {
                setReviews(allReviews);
            } else {
                
                const filteredReviews = allReviews.filter((review) =>
                    review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    review.review.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    review.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    review.user?.username.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setReviews(filteredReviews);
            }
        } catch (error) {
            console.error('An error occurred during search:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-76px)] relative">
            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Welcome back, <span className="text-red-500">{user.username}</span>
                        </h1>
                        <button
                            onClick={() => setShowAddReview(true)}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg
                                hover:bg-red-700 transition duration-150 ease-in-out gap-2"
                        >
                            <Plus className="h-5 w-5" />
                            <span className="hidden sm:inline">Add Review</span>
                        </button>
                    </div>

                    <form onSubmit={handleSearch} className="relative">
                        <div className="flex gap-3">
                            <div className="flex-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg 
                                        bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 
                                        focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out"
                                    placeholder="Search reviews..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="inline-flex items-center px-6 py-2.5 border border-transparent 
                                    text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 
                                    transition duration-150 ease-in-out min-w-[100px] justify-center"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    {isLoading && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                            <Loader />
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        {reviews.length > 0 ? (
                            <div className="grid gap-6">
                                {reviews.map((review) => (
                                    <div
                                        key={review._id}
                                        className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="flex flex-col space-y-4">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <div className="bg-red-100 px-3 py-1 rounded-full">
                                                        <span className="text-sm font-medium text-red-600">
                                                            {review.location}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                {/* <button
                                                    onClick={() => handleDeleteReview(review._id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-full"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button> */}
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="font-semibold text-lg text-gray-900">
                                                    {review.title}
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed">
                                                    {review.review}
                                                </p>
                                            </div>

                                            <div className="text-sm text-gray-500">
                                                <span className="font-medium text-gray-900">By: </span>
                                                <span className="text-gray-800 font-bold">{review.user?.username || 'Anonymous'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
                                <Star className="h-8 w-8 text-red-500" />
                                <p className="text-gray-500 font-medium">No reviews found yet.</p>
                                <button
                                    onClick={() => setShowAddReview(true)}
                                    className="text-red-500 hover:text-red-600 text-sm font-medium"
                                >
                                    Add your first review
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showAddReview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
                        <form onSubmit={handleSubmit(handleSubmitReview)} className="p-6 space-y-6">
                            <input
                                type="text"
                                {...register('location', { required: true })}
                                placeholder="Enter location"
                                className="block w-full px-3 py-2 border rounded-lg"
                            />
                            <input
                                type="text"
                                {...register('title', { required: true })}
                                placeholder="Enter title"
                                className="block w-full px-3 py-2 border rounded-lg"
                            />
                            <textarea
                                {...register('review', { required: true })}
                                rows={4}
                                placeholder="Write your review..."
                                className="block w-full px-3 py-2 border rounded-lg"
                            />

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddReview(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white
                                   border border-gray-300 rounded-lg hover:bg-gray-50
                                   focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}



            <BottomNav />
        </div>
    );
}

export default Reviews;
