import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUserAnalytics } from '../hooks/useUserAnalytics';

function UserProfile() {
  const { user, signOut, updateProfile, loading } = useAuth();
  const { analytics, loading: analyticsLoading, refreshAnalytics } = useUserAnalytics();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.user_metadata?.profile_picture || null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: user?.user_metadata?.first_name || '',
    lastName: user?.user_metadata?.last_name || '',
    company: user?.user_metadata?.company || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    title: user?.user_metadata?.title || '',
    bio: user?.user_metadata?.bio || ''
  });
  const [updating, setUpdating] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Sync profile image with user data
  useEffect(() => {
    if (user?.user_metadata?.profile_picture && !imagePreview) {
      setProfileImage(user.user_metadata.profile_picture);
    }
  }, [user?.user_metadata?.profile_picture, imagePreview]);

  // Sync form data with user updates
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user?.user_metadata?.first_name || '',
        lastName: user?.user_metadata?.last_name || '',
        company: user?.user_metadata?.company || '',
        email: user?.email || '',
        phone: user?.user_metadata?.phone || '',
        title: user?.user_metadata?.title || '',
        bio: user?.user_metadata?.bio || ''
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file) => {
    // Clear any previous errors
    setError('');
    setImageUploading(true);

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit. Please select a smaller image file.');
      setImageUploading(false);
      return;
    }

    // Check file type - support common image formats
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file format. Please upload a JPEG, PNG, GIF, or WebP image.');
      setImageUploading(false);
      return;
    }

    // Create an image element to check dimensions and potentially compress
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => {
        try {
          // Set maximum dimensions (for profile photos, 400x400 is usually enough)
          const maxDimension = 400;
          let { width, height } = img;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > height && width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }

          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;

          // Draw and compress the image
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to blob with compression (0.8 quality for JPEG)
          const quality = file.type === 'image/jpeg' ? 0.8 : 0.9;
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedReader = new FileReader();
              compressedReader.onload = (event) => {
                setImagePreview(event.target.result);
                setImageUploading(false);
                setMessage(`Profile image uploaded successfully. ${file.size > blob.size ? 'Image optimized for better performance. ' : ''}Please save your changes to update your profile.`);
                setTimeout(() => setMessage(''), 5000);
              };
              compressedReader.onerror = () => {
                setError('Unable to process the image file. Please try a different image.');
                setImageUploading(false);
              };
              compressedReader.readAsDataURL(blob);
            } else {
              // Fallback to original if compression fails
              setImagePreview(e.target.result);
              setImageUploading(false);
              setMessage('Profile image uploaded successfully. Please save your changes to update your profile.');
              setTimeout(() => setMessage(''), 4000);
            }
          }, file.type, quality);
        } catch (error) {
          // Fallback to original image if processing fails
          setImagePreview(e.target.result);
          setImageUploading(false);
          setMessage('Profile image uploaded successfully. Please save your changes to update your profile.');
          setTimeout(() => setMessage(''), 4000);
        }
      };
      img.onerror = () => {
        setError('Unable to load the selected image. Please choose a different file.');
        setImageUploading(false);
      };
      img.src = e.target.result;
    };
    reader.onerror = () => {
      setError('Unable to read the image file. Please try uploading a different image.');
      setImageUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const removeProfileImage = () => {
    setImagePreview(null);
    setProfileImage(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setMessage('Profile image removed. Please save your changes to update your profile.');
    setTimeout(() => setMessage(''), 4000);
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      processImageFile(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setMessage('');

    try {
      const updates = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        company: formData.company,
        phone: formData.phone,
        title: formData.title,
        bio: formData.bio,
        full_name: `${formData.firstName} ${formData.lastName}`.trim()
      };

      // Handle profile picture updates
      if (imagePreview) {
        // New image was uploaded
        updates.profile_picture = imagePreview;
      } else if (profileImage === null && user?.user_metadata?.profile_picture) {
        // Image was removed - explicitly set to null
        updates.profile_picture = null;
      }

      const { data, error } = await updateProfile(updates);

      if (error) {
        setError(error.message);
      } else {
        // Determine the success message based on what was updated
        let successMessage = 'Profile updated successfully!';
        if (imagePreview) {
          successMessage = 'Profile updated successfully! Your new profile image has been saved.';
        } else if (profileImage === null && user?.user_metadata?.profile_picture) {
          successMessage = 'Profile updated successfully! Profile image has been removed.';
        }
        
        setMessage(successMessage);
        setIsEditing(false);
        
        // Update the profile image state based on what was saved
        if (imagePreview) {
          setProfileImage(imagePreview);
        } else if (profileImage === null) {
          // Image was removed, keep it null
          setProfileImage(null);
        }
        setImagePreview(null);
        
        // The profile info will automatically update because we're now using
        // the user data that gets updated by the updateProfile function
        refreshAnalytics(); // Refresh analytics after profile update
        setTimeout(() => setMessage(''), 4000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Profile update error:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto"></div>
          <p className="text-slate-800 font-bold text-lg mt-4 text-center">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Enhanced Header */}
      <div className="relative bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-xl sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-6">
          <button
            onClick={() => navigate('/')}
            className="group bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:from-slate-800 hover:to-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span className="flex items-center space-x-2">
              <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
              <span>Back to home</span>
            </span>
          </button>
          <div className="text-center">
            <h1 className="text-5xl font-black bg-gradient-to-r from-slate-800 via-purple-700 to-pink-700 bg-clip-text text-transparent">My Dashboard</h1>
            <p className="text-gray-600 mt-2 font-medium text-lg">Welcome back, manage your compliance journey</p>
          </div>
          <div className="w-24"></div>
        </div>
      </div>

      <div className="relative container mx-auto px-6 py-12 max-w-7xl">
        <div className="max-w-6xl mx-auto">
          
          {/* Enhanced Profile Card with Glass Effect */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-12 lg:p-16 mb-12 relative overflow-hidden">
            {/* Floating Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-2xl"></div>
            
            <div className="relative flex items-start justify-between mb-8">
              <div className="flex items-start space-x-8">
                {/* Professional Profile Photo Section */}
                <div className="relative group">
                  <div 
                    className="w-40 h-40 rounded-2xl overflow-hidden shadow-xl border-2 border-gray-200/80 bg-gradient-to-br from-slate-100 to-gray-200 flex items-center justify-center relative transition-all duration-300 group-hover:shadow-2xl group-hover:border-gray-300"
                    onDragOver={isEditing ? handleDragOver : undefined}
                    onDragEnter={isEditing ? handleDragEnter : undefined}
                    onDragLeave={isEditing ? handleDragLeave : undefined}
                    onDrop={isEditing ? handleDrop : undefined}
                  >
                    {/* Professional Subtle Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 group-hover:from-blue-100/60 group-hover:to-indigo-100/60 transition-all duration-300"></div>
                    
                    {profileImage || imagePreview ? (
                      <img 
                        src={imagePreview || profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover relative z-10 transition-all duration-300"
                      />
                    ) : (
                      <div className="relative z-10 w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                        <span className="text-4xl text-white font-bold tracking-wider">
                          {isEditing && formData.firstName 
                            ? formData.firstName.charAt(0).toUpperCase()
                            : (user?.user_metadata?.first_name?.charAt(0) || user?.email?.charAt(0) || '?')
                          }
                        </span>
                      </div>
                    )}

                    {/* Loading Indicator */}
                    {imageUploading && (
                      <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center z-30 border-2 border-blue-200">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-600 border-t-transparent mx-auto mb-2"></div>
                          <p className="text-slate-700 text-xs font-semibold">Processing image...</p>
                        </div>
                      </div>
                    )}

                    {/* Professional Edit Indicator */}
                    {isEditing && !imageUploading && (
                      <div className="absolute top-3 right-3 w-7 h-7 bg-white shadow-lg rounded-full flex items-center justify-center border border-gray-200 z-20 group-hover:bg-blue-50 transition-all duration-200">
                        <svg className="w-3.5 h-3.5 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                    )}

                    {/* Simple Preview Indicator */}
                    {isEditing && (imagePreview || (formData.firstName !== user?.user_metadata?.first_name || formData.lastName !== user?.user_metadata?.last_name)) && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white rounded px-2 py-0.5 text-xs font-medium shadow-md z-20">
                        Preview
                      </div>
                    )}
                  </div>
                  
                  {/* Simple Upload Overlay */}
                  {isEditing && !imageUploading && (
                    <div className="absolute inset-0 bg-white/90 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer z-10 border-2 border-dashed border-blue-300">
                      <div className="text-center p-4">
                        <div className="w-8 h-8 mx-auto bg-blue-600 rounded-lg flex items-center justify-center mb-3">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-slate-700 text-sm font-medium mb-1">Upload Photo</p>
                        <p className="text-slate-500 text-xs mb-3">Click or drag & drop</p>
                        
                        <button
                          type="button"
                          onClick={triggerImageUpload}
                          disabled={imageUploading}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-2"
                        >
                          Select File
                        </button>
                        
                        <div className="text-xs text-slate-500">
                          JPG, PNG • Max 5MB
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Professional Status Badges */}
                  {imagePreview && !imageUploading && (
                    <div className="absolute -bottom-1 -right-1 bg-green-600 text-white rounded-lg px-2 py-1 text-[10px] font-semibold shadow-lg z-20 border border-white">
                      ✓ Ready to Save
                    </div>
                  )}

                  {imageUploading && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-lg px-2 py-1 text-[10px] font-semibold shadow-lg z-20 animate-pulse border border-white">
                      ⏳ Processing
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Enhanced Profile Info */}
                <div className="flex-1 relative">
                  {/* Simple Live Preview Badge */}
                  {isEditing && (
                    <div className="absolute -top-1 -left-1 bg-blue-600 text-white rounded px-2 py-0.5 text-xs font-medium shadow-md z-10">
                      Live Preview
                    </div>
                  )}
                  
                  <div className={`transition-all duration-300 ${isEditing ? 'bg-blue-50/40 rounded-lg p-3 border border-blue-200/60' : ''}`}>
                    <h2 className="text-4xl font-bold text-slate-800 mb-2 transition-all duration-300">
                      {isEditing && (formData.firstName || formData.lastName) 
                        ? `${formData.firstName} ${formData.lastName}`.trim() 
                      : (user?.user_metadata?.full_name || 'User Profile')
                    }
                  </h2>
                  <p className="text-gray-600 text-lg mb-3">{user?.email}</p>
                  
                  {(isEditing ? formData.title : user?.user_metadata?.title) && (
                    <div className="mb-3">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-medium">
                        💼 {isEditing ? formData.title : user.user_metadata.title}
                      </span>
                    </div>
                  )}
                  
                  {(isEditing ? formData.company : user?.user_metadata?.company) && (
                    <div className="mb-3">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg font-medium">
                        🏢 {isEditing ? formData.company : user.user_metadata.company}
                      </span>
                    </div>
                  )}
                  
                  {(isEditing ? formData.phone : user?.user_metadata?.phone) && (
                    <p className="text-gray-600 mb-3">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded mr-2 text-sm">📞</span>
                      {isEditing ? formData.phone : user.user_metadata.phone}
                    </p>
                  )}
                  
                  {(isEditing ? formData.bio : user?.user_metadata?.bio) && (
                    <div className="mt-4">
                      <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                        {isEditing ? formData.bio : user.user_metadata.bio}
                      </p>
                    </div>
                  )}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2"
              >
                {isEditing ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>Edit Profile</span>
                  </>
                )}
              </button>
            </div>

            {/* Enhanced Account Status */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-400/20 rounded-full blur-xl"></div>
              <div className="relative flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-white text-xl font-black">✅</span>
                </div>
                <div>
                  <p className="text-green-800 font-black text-xl">Account Verified</p>
                  <p className="text-green-600 text-sm font-medium">Your email has been verified and account is active</p>
                </div>
              </div>
            </div>

            {/* Enhanced Edit Form */}
            {isEditing && (
              <div className="bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-xl p-10 rounded-3xl border-2 border-white/40 shadow-2xl relative overflow-hidden">
                {/* Floating Background Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-2xl"></div>
                
                <form onSubmit={handleUpdateProfile} className="space-y-8 relative">
                  <h3 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent mb-8 text-center">
                    ✏️ Edit Your Profile
                  </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Software Engineer, Manager, etc."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us a bit about yourself and your role..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-500 bg-gray-100 cursor-not-allowed"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    🔒 Email cannot be changed for security reasons
                  </p>
                </div>

                {/* Image Change Notice */}
                {(imagePreview || (profileImage === null && user?.user_metadata?.profile_picture)) && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-blue-800 text-sm font-medium">
                          {imagePreview 
                            ? 'You have a new profile image ready to save.' 
                            : 'Profile image will be removed when you save changes.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Professional Error Message */}
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-red-800 text-sm font-medium">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Professional Success Message */}
                {message && (
                  <div className="bg-green-50 border-l-4 border-green-400 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-green-800 text-sm font-medium">{message}</p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {updating ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Updating Profile...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Save Changes</span>
                    </span>
                  )}
                </button>
              </form>
            </div>
            )}
          </div>

          {/* Enhanced Usage Dashboard - Full Width */}
          <div className="mb-12 -mx-6">
            {/* Usage Statistics */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 lg:p-12 mx-6 relative overflow-hidden">
              {/* Background Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-400/20 to-cyan-400/20 rounded-full blur-2xl"></div>
              
              <div className="relative">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
                  <h3 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent mb-4 md:mb-0">
                    📊 Usage Dashboard
                  </h3>
                  <button
                    onClick={refreshAnalytics}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg transform hover:scale-105 font-bold"
                  >
                    🔄 Refresh Analytics
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-3xl border-2 border-blue-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden group cursor-pointer">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/20 rounded-full blur-xl group-hover:w-24 group-hover:h-24 transition-all duration-300"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-white text-xl font-black">📄</span>
                        </div>
                        <div className="text-blue-400 text-xs font-bold uppercase tracking-wider">This Week</div>
                      </div>
                      <div className="text-5xl font-black text-blue-600 mb-3 leading-none">
                        {analyticsLoading ? (
                          <div className="animate-pulse bg-blue-300 h-12 w-20 rounded-xl"></div>
                        ) : (
                          <span className="animate-in slide-in-from-bottom duration-500">{analytics.documentsAnalyzed}</span>
                        )}
                      </div>
                      <div className="text-blue-800 font-bold text-lg mb-2">Documents Analyzed</div>
                      <div className="text-blue-600 text-sm font-medium bg-blue-100/50 px-3 py-1 rounded-full inline-block">
                        +{analytics.trendData.documentsThisWeek} this week
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-3xl border-2 border-green-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden group cursor-pointer">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-400/20 rounded-full blur-xl group-hover:w-24 group-hover:h-24 transition-all duration-300"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-white text-xl font-black">🔍</span>
                        </div>
                        <div className="text-green-400 text-xs font-bold uppercase tracking-wider">Identified</div>
                      </div>
                      <div className="text-5xl font-black text-green-600 mb-3 leading-none">
                        {analyticsLoading ? (
                          <div className="animate-pulse bg-green-300 h-12 w-20 rounded-xl"></div>
                        ) : (
                          <span className="animate-in slide-in-from-bottom duration-700">{analytics.gapsFound}</span>
                        )}
                      </div>
                      <div className="text-green-800 font-bold text-lg mb-2">Gaps Found</div>
                      <div className="text-green-600 text-sm font-medium bg-green-100/50 px-3 py-1 rounded-full inline-block">
                        {analytics.trendData.gapsResolved > 0 ? `-${analytics.trendData.gapsResolved} resolved` : 'Track progress'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-3xl border-2 border-orange-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden group cursor-pointer">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-orange-400/20 rounded-full blur-xl group-hover:w-24 group-hover:h-24 transition-all duration-300"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-white text-xl font-black">📊</span>
                        </div>
                        <div className="text-orange-400 text-xs font-bold uppercase tracking-wider">Average</div>
                      </div>
                      <div className="text-5xl font-black text-orange-600 mb-3 leading-none">
                        {analyticsLoading ? (
                          <div className="animate-pulse bg-orange-300 h-12 w-20 rounded-xl"></div>
                        ) : (
                          <span className="animate-in slide-in-from-bottom duration-1100">{analytics.averageComplianceScore}%</span>
                        )}
                      </div>
                      <div className="text-orange-800 font-bold text-lg mb-2">Compliance Score</div>
                      <div className="text-orange-600 text-sm font-medium bg-orange-100/50 px-3 py-1 rounded-full inline-block">
                        {analytics.trendData.improvementPercentage !== 0 
                          ? `${analytics.trendData.improvementPercentage > 0 ? '+' : ''}${analytics.trendData.improvementPercentage}% trend`
                          : 'No trend data'
                        }
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-3xl border-2 border-purple-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden group cursor-pointer">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/20 rounded-full blur-xl group-hover:w-24 group-hover:h-24 transition-all duration-300"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-white text-xl font-black">⚡</span>
                        </div>
                        <div className="text-purple-400 text-xs font-bold uppercase tracking-wider">Generated</div>
                      </div>
                      <div className="text-5xl font-black text-purple-600 mb-3 leading-none">
                        {analyticsLoading ? (
                          <div className="animate-pulse bg-purple-300 h-12 w-20 rounded-xl"></div>
                        ) : (
                          <span className="animate-in slide-in-from-bottom duration-900">{analytics.policiesGenerated || 0}</span>
                        )}
                      </div>
                      <div className="text-purple-800 font-bold text-lg mb-2">Policies Generated</div>
                      <div className="text-purple-600 text-sm font-medium bg-purple-100/50 px-3 py-1 rounded-full inline-block">
                        +{analytics.trendData.policiesGeneratedThisWeek || 0} this week
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Recent Activity */}
                <div className="bg-gradient-to-br from-gray-50 to-purple-50 p-6 rounded-xl border border-white/50">
                  <h4 className="font-black text-slate-800 mb-4 flex items-center">
                    🕒 Recent Activity
                  </h4>
                  {analyticsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse p-3 bg-gray-200 rounded-lg"></div>
                      ))}
                    </div>
                  ) : analytics.recentActivity.length > 0 ? (
                    <div className="space-y-3">
                    {analytics.recentActivity.map((activity, index) => (
                      <div key={activity.id || index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            {activity.type === 'policy_analysis' ? '📋' : '⚡'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{activity.title}</p>
                            <p className="text-gray-500 text-xs">
                              {new Date(activity.timestamp).toLocaleDateString()} • {activity.description}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                          activity.status === 'success' ? 'bg-green-100 text-green-700' :
                          activity.status === 'warning' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {activity.score ? `${activity.score}%` : 
                           activity.status === 'success' ? '✅ Complete' :
                           activity.status === 'warning' ? '⏳ Review' : '❌ Action Needed'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">📊</div>
                    <p className="text-gray-500 text-sm">No recent activity</p>
                    <p className="text-gray-400 text-xs">Start analyzing documents to see activity here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          
          {/* Account Info - Full Width */}
          <div className="mb-20 mt-16">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12 max-w-2xl mx-auto">
              <h3 className="text-2xl font-black bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent mb-8 flex items-center justify-center">
                👤 Account Overview
              </h3>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg font-black">✅</span>
                    </div>
                    <span className="text-green-800 font-bold text-lg">Account Verified</span>
                  </div>
                  <p className="text-green-600 text-sm">Your email has been verified and account is active</p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg font-black">💎</span>
                    </div>
                    <span className="text-blue-800 font-bold text-lg">{analytics.planUsage?.planType || 'Free'} Plan</span>
                  </div>
                  <p className="text-blue-600 text-sm mb-3">
                    {analytics.planUsage?.current || 0}/{analytics.planUsage?.limit || 10} analyses used this month
                  </p>
                  <div className="w-full bg-blue-200 rounded-full h-3 mb-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(((analytics.planUsage?.current || 0) / (analytics.planUsage?.limit || 10)) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <button
                    onClick={() => navigate('/pricing')}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
                  >
                    {(analytics.planUsage?.current || 0) >= (analytics.planUsage?.limit || 10) ? 'Upgrade Now →' : 'Upgrade Plan →'}
                  </button>
                </div>

                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-gray-500 text-sm font-medium">
                    Member since: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                  </p>
                  {!analyticsLoading && (analytics.accountAge || 0) > 0 && (
                    <p className="text-gray-400 text-xs mt-2">
                      {analytics.accountAge} days • Welcome to Poligap! 🎉
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account Management - Full Width */}
          <div className="mb-20">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12 max-w-2xl mx-auto">
              <h3 className="text-xl font-black bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent mb-8 flex items-center justify-center">
                ⚙️ Account Management
              </h3>
              <div className="space-y-5">
                <button className="w-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 p-4 rounded-xl font-bold hover:from-blue-200 hover:to-blue-300 transition-all duration-300 text-left flex items-center justify-between">
                  <span className="flex items-center space-x-3">
                    <span>📊</span>
                    <span>Export My Data</span>
                  </span>
                  <span>→</span>
                </button>
                
                <button className="w-full bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 p-4 rounded-xl font-bold hover:from-yellow-200 hover:to-yellow-300 transition-all duration-300 text-left flex items-center justify-between">
                  <span className="flex items-center space-x-3">
                    <span>📧</span>
                    <span>Email Preferences</span>
                  </span>
                  <span>→</span>
                </button>
                
                <button
                  onClick={handleSignOut}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                >
                  <span>🚪</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
