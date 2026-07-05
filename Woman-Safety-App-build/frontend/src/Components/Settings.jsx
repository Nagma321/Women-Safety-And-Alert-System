import React, { useContext, useState } from 'react';
import { ChevronLeft, User, Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import api from '../../API/CustomApi';
import { Config } from '../../API/Config';
import { AuthContext } from '../Context/AuthContext';

function Settings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const {user} = useContext(AuthContext)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
  
    try {
      
      if (data.username) {
        const response = await api.post(Config.UPDATEUSERNAME, {
          userId: user._id,
          username: data.username,
        });
  
        if (response.data.success) {
          setSuccessMessage('Username updated successfully');
          reset({ username: '' });
        }
      }
  
      
      if (data.email) {
        const response = await api.post(Config.UPDATEEMAIL, {
          userId: user._id,
          email: data.email,
          isGoogleUser: user.isGoogleUser,
        });
  
        if (response.data.success) {
          setSuccessMessage('Email updated successfully');
          reset({ email: '' });
        }
      }
  
      
      if (data.currentPassword && data.newPassword) {
        if (data.newPassword !== data.confirmPassword) {
          setError('New passwords do not match');
          return;
        }
  
        const response = await api.post(Config.UPDATEPASSWORD, {
          userId: user._id,
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          isGoogleUser: user.isGoogleUser,
        });
  
        if (response.data.success) {
          setSuccessMessage('Password updated successfully');
          reset({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10 py-4">
        <div className="max-w-2xl mx-auto px-4 flex items-center gap-3">
          <Link to="/profile" className="text-gray-500 hover:text-gray-700">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
            <p>{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username Section */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Update Username</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">New Username</label>
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  {...register('username', {
                    minLength: {
                      value: 3,
                      message: 'Username must be at least 3 characters'
                    }
                  })}
                  className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter new username"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username.message}</p>
              )}
            </div>
          </div>

          {/* Email Section */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Update Email</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">New Email</label>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="email"
                  {...register('email', {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email'
                    }
                  })}
                  className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter new email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Password Section */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Update Password</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <div className="flex items-center">
                  <Lock className="w-5 h-5 text-gray-400 mr-2" />
                  <input
                    type="password"
                    {...register('currentPassword')}
                    className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter current password"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <div className="flex items-center">
                  <Lock className="w-5 h-5 text-gray-400 mr-2" />
                  <input
                    type="password"
                    {...register('newPassword', {
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter new password"
                  />
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <div className="flex items-center">
                  <Lock className="w-5 h-5 text-gray-400 mr-2" />
                  <input
                    type="password"
                    {...register('confirmPassword')}
                    className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-700 text-white py-2 px-4 rounded-md hover:bg-pink-600 disabled:opacity-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Settings;