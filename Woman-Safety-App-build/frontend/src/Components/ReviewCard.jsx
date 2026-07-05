import { Luggage, Star } from 'lucide-react';

const ReviewCard = ({ location, title, review, createdAt , username}) => (
  <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <div className="bg-red-100 px-3 py-1 rounded-full">
          <span className="text-sm font-medium text-red-600">{location}</span>
        </div>
        <span className="text-xs text-gray-400">{new Date(createdAt).toLocaleDateString()}</span>
      </div>
      {/* <button
        // onClick={() => handleDeleteReview(review._id)}
        className="p-2 text-gray-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-full"
      >
        <Trash2 className="h-4 w-4" />
      </button> */}
    </div>

    <div className="space-y-2">
      <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{review}</p>
    </div>

    <div className="text-sm text-gray-500">
      <span className="font-medium text-gray-900">By: </span>
      <span className="text-gray-800 font-bold">{username}</span>
    </div>
  </div>
);

export default ReviewCard;