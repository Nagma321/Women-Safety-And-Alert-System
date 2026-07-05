
import User from "../Models/UserModel.js";

const AddReview = async (req, res) => {
    const { location, title, review, userId } = req.body

    if (!location || !title || !review || !userId) {
        return res.status(400).json({ message: "All fields are required" });

    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $push: {
                    reviews: { user: userId, location, title, review }
                }
            },
            { new: true }
        )
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const newReview = updatedUser.reviews[updatedUser.reviews.length - 1];

        res.status(201).json({
            message: "Review Added Succesfully",
            review: newReview,
            user:{
               username : updatedUser.username,
               photo : updatedUser.profilePhoto
            }
        })
    } catch (error) {
        res.status(500).json({ message: "Internal Error occured", error })
    }


}

const GetAllReviews = async (req, res) => {
    try {
        
        const users = await User.find({}, 'reviews username email');

       
        const allReviews = users.flatMap(user =>
            user.reviews.map(review => ({
                ...review.toObject(),
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email
                }
            }))
        );

        res.status(200).json({
            message: "All reviews fetched successfully",
            reviews: allReviews
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error in getting reviews",
            error: error.message
        });
    }
};

export { AddReview, GetAllReviews }