import React, { useState, useEffect } from "react";
import userService from "../services/ProfileServices";

const UserProfile = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        role: ''
    });

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userData = await userService.getUserProfile();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user details', error);
            }
        };

        fetchUserDetails();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = await userService.updateUserProfile(user);
            setUser(updatedUser);
            setShowModal(true);
        } catch (error) {
            console.error('There was an error updating the profile!', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg">
                <h2 className="mb-6 text-3xl font-bold text-center text-gray-700">User Profile</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label className="block mb-2 text-sm font-bold text-gray-700">Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-bold text-gray-700">Email:</label>
                        <input
                            type="text"
                            name="email"
                            value={user.email}
                            readOnly
                            className="w-full px-3 py-2 text-gray-700 border rounded-lg bg-gray-100 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-bold text-gray-700">Phone:</label>
                        <input
                            type="text"
                            name="phone"
                            value={user.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-bold text-gray-700">Address:</label>
                        <input
                            type="text"
                            name="address"
                            value={user.address}
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-bold text-gray-700">Role:</label>
                        <input
                            type="text"
                            name="role"
                            value={user.role}
                            readOnly
                            className="w-full px-3 py-2 text-gray-700 border rounded-lg bg-gray-100 cursor-not-allowed"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full py-3 mt-6 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                    Update Profile
                </button>
            </form>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                        <h3 className="mb-4 text-xl font-semibold text-gray-700">Success</h3>
                        <p className="mb-6 text-gray-600">Your profile has been updated successfully!</p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
