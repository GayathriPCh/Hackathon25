import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
          setEditData(docSnap.data()); // preload edit fields
          setUserId(user.uid);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };
  const checkProfileCompletion = (data) => {
    const requiredFields = ['name', 'email', 'role', 'bio', 'skills', 'experience', 'location', 'resumeLink'];
    return requiredFields.every(field => {
      const value = data[field];
      if (Array.isArray(value)) return value.length > 0;
      return value && value.toString().trim() !== '';
    });
  };
  
  const handleSave = async () => {
    if (userId) {
      const updatedData = {
        ...editData,
        profileCompleted: checkProfileCompletion(editData),
      };
  
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, updatedData);
      setUserData(updatedData);
      setIsEditing(false);
    }
  };
  

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  if (loading) return <div className="profile-container"><p>Loading...</p></div>;
  if (!userData) return <div className="profile-container"><p>No user data found.</p></div>;

  return (
    <div className="profile-container">
      <h1>Your Profile</h1>
      <div className="profile-box">
        <p><strong>Name:</strong> 
          {isEditing ? (
            <input name="name" value={editData.name || ''} onChange={handleChange} />
          ) : (
            userData.name || userData.displayName
          )}
        </p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Role:</strong> 
  {isEditing ? (
    <>
      <label>
        <input
          type="radio"
          name="role"
          value="seeker"
          checked={editData.role === 'seeker'}
          onChange={handleChange}
        />
        Seeker
      </label>
      {' '}
      <label>
        <input
          type="radio"
          name="role"
          value="employer"
          checked={editData.role === 'employer'}
          onChange={handleChange}
        />
        Employer
      </label>
    </>
  ) : (
    userData.role
  )}
</p>

        <p><strong>Bio:</strong> 
          {isEditing ? (
            <textarea name="bio" value={editData.bio || ''} onChange={handleChange} />
          ) : (
            userData.bio || 'N/A'
          )}
        </p>
        <p><strong>Skills:</strong> 
          {isEditing ? (
            <input
              name="skills"
              value={editData.skills?.join(', ') || ''}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  skills: e.target.value.split(',').map((s) => s.trim()),
                }))
              }
            />
          ) : (
            userData.skills?.join(', ') || 'N/A'
          )}
        </p>
        <p><strong>Experience:</strong> 
          {isEditing ? (
            <input name="experience" value={editData.experience || ''} onChange={handleChange} />
          ) : (
            userData.experience || 'N/A'
          )}
        </p>
        <p><strong>Resume Link</strong> 
          {isEditing ? (
            <input name="resumelink" value={editData.resumeLink || ''} onChange={handleChange} />
          ) : (
            userData.resumeLink || 'N/A'
          )}
        </p>
        <p><strong>Location:</strong> 
          {isEditing ? (
            <input name="location" value={editData.location || ''} onChange={handleChange} />
          ) : (
            userData.location || 'N/A'
          )}
        </p>
        <p><strong>Profile Completed:</strong> {userData.profileCompleted ? 'Yes' : 'No'}</p>

        {isEditing ? (
          <div style={{ marginTop: '1rem' }}>
            <button onClick={handleSave} className="btn">Save</button>
            <button onClick={handleCancel} className="btn btn-secondary">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="btn">Edit</button>
        )}
      </div>
    </div>
  );
};

export default Profile;
