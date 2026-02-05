"use client";

import { Lock, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { auth, db, storage } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoUploadEnabled = false;

  // Form states
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    role: 'Admin' // Default role as we don't have it in standard auth
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Default values from Auth
        let newFormData = {
          displayName: currentUser.displayName || '',
          email: currentUser.email || '',
          phoneNumber: currentUser.phoneNumber || '',
          role: 'Admin'
        };

        // Fetch additional data from Firestore
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            newFormData = {
              ...newFormData,
              phoneNumber: userData.phoneNumber || newFormData.phoneNumber,
              role: userData.role || newFormData.role,
              // We can also sync displayName if needed, but let's prioritize Auth for display name
              // displayName: userData.displayName || newFormData.displayName
            };
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
        }

        setFormData(newFormData);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // 1. Update Auth Profile (Display Name)
      await updateProfile(user, {
        displayName: formData.displayName
      });
      
      // 2. Update Firestore Document (Phone, Role, and sync Display Name/Email)
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        displayName: formData.displayName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      alert('Profil berhasil diperbarui!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Gagal memperbarui profil. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!photoUploadEnabled) return;
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File terlalu besar. Maksimal 2MB.');
      return;
    }

    setUploading(true);
    try {
      // Create a reference to 'admin-profiles/<uid>/<filename>'
      const storageRef = ref(storage, `admin-profiles/${user.uid}/${file.name}`);
      
      // Upload the file
      await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Update Auth Profile
      await updateProfile(user, { photoURL: downloadURL });
      
      // Update Firestore Document
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        photoURL: downloadURL,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // Force reload user to update UI (or we could manually update local state)
      await user.reload();
      // Trigger a re-render by updating the user state with a new object reference if needed
      // or rely on the fact that `user.photoURL` might not update in the current `user` object immediately without reload
      // A simple way to refresh the UI is to update the key on a clone if we don't want to wait for auth listener
      // But user.reload() should sync it. 
      // Let's also update the local user object to be safe for immediate feedback
      setUser({ ...user, photoURL: downloadURL } as FirebaseUser);
      
      alert('Foto profil berhasil diperbarui!');
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert('Gagal mengupload foto. Silakan coba lagi.');
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Pengaturan</h1>
        <p className="text-gray-600">Kelola pengaturan sistem dan preferensi admin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Menu */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-4 space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'profile'
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Profil Admin</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'security'
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Lock className="w-5 h-5" />
              <span>Keamanan</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-gray-900 mb-6">Profil Admin</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center overflow-hidden">
                    {user?.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-teal-700" />
                    )}
                  </div>
                  {photoUploadEnabled && (
                    <div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handlePhotoChange}
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:bg-teal-400"
                      >
                        {uploading ? 'Mengupload...' : 'Ganti Foto'}
                      </button>
                      <p className="text-gray-500 mt-2">JPG, PNG. Max 2MB</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Nama Lengkap"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Nomor Telepon</label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="+62..."
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Role</label>
                    <select 
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option>Super Admin</option>
                      <option>Admin</option>
                      <option>Moderator</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    onClick={() => {
                      if (user) {
                        setFormData({
                          displayName: user.displayName || '',
                          email: user.email || '',
                          phoneNumber: user.phoneNumber || '',
                          role: 'Admin'
                        });
                      }
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    disabled={saving}
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleSaveProfile}
                    className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors disabled:bg-teal-400"
                    disabled={saving}
                  >
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-gray-900 mb-6">Keamanan</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Password Lama</label>
                  <input
                    type="password"
                    placeholder="Masukkan password lama"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Password Baru</label>
                  <input
                    type="password"
                    placeholder="Masukkan password baru"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    placeholder="Konfirmasi password baru"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <button className="w-full px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors">
                  Ubah Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
