import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { getAuth, updateProfile } from "firebase/auth";

const Profile = () => {
  const { user, auth } = useContext(AuthContext);
  const [name, setName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Update Firebase profile
      const firebaseUser = getAuth().currentUser;
      await updateProfile(firebaseUser, { displayName: name, photoURL });
      // Update backend user profile
      await fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, photoURL }),
      });
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-base-100 rounded shadow mt-4">
      <h2 className="text-xl font-bold mb-4">My Profile</h2>
      <form className="grid grid-cols-1 gap-4" onSubmit={handleUpdate}>
        <label className="form-control flex flex-col">
          <span className="label-text mb-1">Name</span>
          <input
            type="text"
            className="input input-bordered"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="form-control flex flex-col">
          <span className="label-text mb-1">Photo URL</span>
          <input
            type="text"
            className="input input-bordered"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            required
          />
        </label>
        <label className="form-control flex flex-col">
          <span className="label-text mb-1">Email</span>
          <input
            type="email"
            className="input input-bordered"
            value={user?.email || ""}
            readOnly
          />
        </label>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
      <div className="flex flex-col items-center mt-6">
        <img
          src={
            photoURL ||
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
          }
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover border border-base-300 mb-2"
        />
        <div className="font-bold text-lg text-gray-800 mt-2">{name}</div>
        <div className="text-sm text-gray-600 mb-2">{user?.email}</div>
      </div>
    </div>
  );
};

export default Profile;
