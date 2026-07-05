import { Home, Map, MessageSquare, User, Edit, LogOut, Star, Settings, Luggage, Camera, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import BottomNav from './Home/BottomNav'
import { useContext, useState } from 'react'
import { AuthContext } from '../Context/AuthContext'
import ReviewCard from './ReviewCard'
import api from '../../API/CustomApi'
import { Config } from '../../API/Config'

const ProfileSection = ({ title, children }) => (
  <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
    <h2 className="font-semibold text-gray-700 p-4 border-b border-gray-100">{title}</h2>
    {children}
  </div>
)

function Profile() {
  const navigate = useNavigate();
  const { user, logout, setUser } = useContext(AuthContext);
  const [isUploading, setIsUploading] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { register, handleSubmit, reset, watch } = useForm();

  const photoFile = watch('photo');

  const handleLogout = async () => {
    const res = await logout();
    if (res) navigate("/login")
  }

  const handleSettings = () => {
    navigate("/settings")
  }

  const handlePhotoChange = () => {
    setShowPhotoModal(true);
  }


  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;


    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      reset({ photo: null });
      return;
    }

    
    const MAX_SIZE = 5 * 1024 * 1024; 
    if (file.size > MAX_SIZE) {
      alert('File size should be less than 5MB');
      reset({ photo: null });
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
  }

  const onSubmit = async (data) => {
    if (!data.photo?.[0]) return;

    setIsUploading(true);
    try {

      const formData = new FormData();
      formData.append('userId', user._id);
      formData.append('photo', data.photo[0]);


      const response = await api.post(Config.ADDPROFILEPHOTO, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });


      if (response.status === 200) {
       // console.log("Updated User:", response.data.updatedUser);
        setUser((prevUser) => ({
          ...prevUser,
          profilePhoto: response.data.updatedUser.profilePhoto
        }))
      }
    } catch (error) {
      console.error("Failed to upload the file", error);
    } finally {
      setIsUploading(false);
      setShowPhotoModal(false);
    }
  };


  const handleCloseModal = () => {
    setShowPhotoModal(false);
    setPreviewUrl(null);
    reset();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900">Profile</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* User Info Section */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100 relative">
          <div className="relative">
            <img
              src={user.profilePhoto ? user.profilePhoto : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvFbJHIvlkPWSvsJ1rWRbr64ZPiCCdb1SCLg&s"}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <button
              className="absolute bottom-0 right-0 bg-red-400 p-1.5 rounded-full text-white hover:bg-red-500 transition-colors"
              onClick={handlePhotoChange}
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{user.username}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
          <div className='absolute top-1 right-1'>
            <button className="absolute top-0 right-0 p-1.5 rounded-full hover:bg-red-500 transition-colors" onClick={handleSettings}>
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <ProfileSection title="Recent Reviews">
          {user.reviews.length > 0 ? user.reviews.map((review, index) => (
            <ReviewCard key={index} {...review} username={user.username} />
          )) : <p className='text-gray-700'>No Reviews Found</p>}
        </ProfileSection>

        {/* Logout Button */}
        <button className="w-full bg-red-50 text-red-500 font-semibold py-4 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2" onClick={handleLogout}>
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      {/* Photo Upload Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Update Profile Photo</h2>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {previewUrl ? (
                  <div className="relative w-32 h-32 mx-auto">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full rounded-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        reset({ photo: null });
                        setPreviewUrl(null);
                      }}
                      className="absolute top-0 right-0 bg-red-500 rounded-full p-1 text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => document.getElementById('photo-upload').click()}
                    className="w-32 h-32 mx-auto border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:border-red-500 transition-colors"
                  >
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                )}

                <input
                  id="photo-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  {...register('photo', {
                    onChange: handleFileChange
                  })}
                />

                <p className="text-sm text-gray-500 text-center">
                  Click to {previewUrl ? 'change' : 'upload'} photo
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white
                    border border-gray-300 rounded-lg hover:bg-gray-50
                    focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!photoFile?.[0] || isUploading}
                  className={`px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2
                    ${!photoFile?.[0] || isUploading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                    }`}
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Upload Photo'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <div className="w-full bg-white shadow-top p-2">
        <BottomNav />
      </div>
    </div>
  )
}

export default Profile