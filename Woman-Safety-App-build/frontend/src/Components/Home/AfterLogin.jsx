import React, { useContext, useEffect, useState } from 'react';
import SOSButton from '../SOSButton';
import { Plus, X, CircleX } from 'lucide-react';
import BottomNav from './BottomNav';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../Context/AuthContext';
import api from '../../../API/CustomApi';
import { Config } from '../../../API/Config';
import Loader from './Loader';
import { toast } from "react-toastify";

function AfterLogin() {

  const [showAddContact, setShowAddContact] = useState(false);

  const { handleSubmit, register } = useForm();

  const { user, setUser } = useContext(AuthContext);

  const [contactsdata, setContactsdata] = useState([]);

  const [showLoader, setShowLoader] = useState(false);

  const [location, setLocation] = useState(null);

  // GET USER CONTACTS + LOCATION
  useEffect(() => {

    setContactsdata(
      Array.isArray(user?.contacts)
        ? user.contacts
        : []
    );

    // LOCATION ACCESS
    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(

        (position) => {

          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });

        },

        (error) => {
          console.log(error);
        },

        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }

      );

    }

  }, [user]);

  // ADD CONTACT
  const Submit = async (formData) => {

    setShowLoader(true);

    try {

      const contactData = new FormData();

      if (formData.photo && formData.photo[0]) {
        contactData.append(
          'photo',
          formData.photo[0]
        );
      }

      contactData.append('name', formData.name);

      contactData.append(
        'MobileNo',
        formData.MobileNo
      );

      contactData.append(
        'userId',
        user._id
      );

      const response = await api.post(
        Config.ContactUrl,
        contactData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        }
      );

      if (response.data) {

        const newContact =
          response.data.contact;

        setUser((prevUser) => ({
          ...prevUser,
          contacts: [
            ...(prevUser.contacts || []),
            newContact,
          ],
        }));

        toast.success(
          "Contact Added Successfully"
        );

        setShowAddContact(false);
      }

    } catch (error) {

      console.error(
        "Error adding contact:",
        error
      );

      toast.error(
        "Failed to add contact"
      );

    } finally {

      setShowLoader(false);

    }
  };

  // DELETE CONTACT
  const handleDelete = async (contactId) => {

    try {

      await api.delete(
        Config.DELETECONTACTUrl,
        {
          params: {
            userId: user._id,
            contactId,
          },
        }
      );

      setContactsdata((prevContacts) =>
        prevContacts.filter(
          (contact) =>
            contact._id !== contactId
        )
      );

      toast.success(
        "Contact Deleted"
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Delete Failed"
      );

    }
  };

  return (

    <div className="w-full p-2 bg-slate-50">

      {/* SOS + LOCATION */}
      <div className="w-full h-fit p-2 flex flex-col items-center justify-center">

        <SOSButton />

        <div className="bg-white shadow-md rounded-xl p-4 mt-5 w-full md:w-[60%] text-center">

          <h1 className="text-xl font-bold text-red-500">
            Current Location
          </h1>

          {location ? (

            <div className="mt-3">

              <p>
                Latitude:
                <span className="font-bold">
                  {" "}
                  {location.latitude}
                </span>
              </p>

              <p className="mt-2">
                Longitude:
                <span className="font-bold">
                  {" "}
                  {location.longitude}
                </span>
              </p>

            </div>

          ) : (

            <p className="mt-3">
              Fetching location...
            </p>

          )}

        </div>

      </div>

      {/* CONTACTS */}
      <div className="w-full p-4">

        <h1 className="text-gray-900 text-xl font-bold md:text-2xl">
          Emergency Contacts
        </h1>

        <div className="w-full flex flex-col gap-3 mt-4">

          {contactsdata.length > 0 ? (

            contactsdata.map(
              (contact, index) => (

                <div
                  key={index}
                  className="w-full p-4 rounded-lg bg-white shadow-sm border flex items-center justify-between"
                >

                  <div className="flex items-center gap-4">

                    <img
                      className="w-16 h-16 rounded-full object-cover"
                      src={
                        contact.photo ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt="Contact"
                    />

                    <div>

                      <h2 className="text-gray-700 font-bold">
                        {contact.name}
                      </h2>

                      <h3 className="text-gray-500">
                        {contact.MobileNo}
                      </h3>

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      handleDelete(contact._id)
                    }
                    className="hover:text-red-500"
                  >

                    <CircleX className="h-6 w-6" />

                  </button>

                </div>

              )
            )

          ) : (

            <h1 className="text-gray-700 font-bold">
              No Contacts Found
            </h1>

          )}

        </div>

      </div>

      {/* ADD CONTACT BUTTON */}
      <div className="w-full p-4 flex items-center justify-center flex-col">

        <button
          className="text-red-400 font-bold flex items-center gap-2 px-4 py-2 hover:bg-red-50 rounded-lg border"
          onClick={() =>
            setShowAddContact(true)
          }
        >

          <Plus className="w-5 h-5" />

          Add New Contact

        </button>

      </div>

      {/* LOADER */}
      {showLoader && (

        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">

          <Loader />

        </div>

      )}

      {/* ADD CONTACT MODAL */}
      {showAddContact && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">

          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">

            <div className="p-6 space-y-6">

              <div className="flex items-center justify-between">

                <h2 className="text-xl font-bold">
                  Add New Contact
                </h2>

                <button
                  onClick={() =>
                    setShowAddContact(false)
                  }
                  className="text-gray-400 hover:text-gray-500"
                >

                  <X className="h-6 w-6" />

                </button>

              </div>

              <form
                onSubmit={handleSubmit(Submit)}
                className="space-y-6"
              >

                <div>

                  <label className="block text-sm font-medium">
                    Profile Photo (Optional)
                  </label>

                  <input
                    type="file"
                    accept="image/png, image/jpg, image/jpeg, image/webp"
                    className="block w-full px-3 py-2 border rounded-lg"
                    {...register('photo')}
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium">
                    Name
                  </label>

                  <input
                    type="text"
                    className="block w-full px-3 py-2 border rounded-lg"
                    {...register(
                      'name',
                      { required: true }
                    )}
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium">
                    Contact Number
                  </label>

                  <input
                    type="text"
                    className="block w-full px-3 py-2 border rounded-lg"
                    {...register(
                      'MobileNo',
                      { required: true }
                    )}
                  />

                </div>

                <div className="flex justify-end gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      setShowAddContact(false)
                    }
                    className="px-4 py-2 text-sm border rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg"
                  >
                    Submit
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      )}

      <BottomNav />

    </div>
  );
}

export default AfterLogin;