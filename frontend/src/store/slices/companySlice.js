import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { companyAPI } from '../../services/api'

// Async thunks
export const createCompany = createAsyncThunk(
  'company/create',
  async (companyData, { rejectWithValue }) => {
    try {
      // Map frontend form data to backend schema
      const backendData = {
        company_name: companyData.name,
        address: companyData.address,
        city: companyData.city,
        state: companyData.state,
        country: companyData.country,
        postal_code: companyData.zipCode,
        website: companyData.website,
        industry: companyData.industry,
        founded_date: companyData.foundedYear ? `${companyData.foundedYear}-01-01` : null,
        description: companyData.description,
        company_size: companyData.size,
        email: companyData.email,
        phone: companyData.phone,
        mission: companyData.mission,
        vision: companyData.vision,
        founding_story: companyData.foundingStory,
        social_links: {
          linkedin: companyData.linkedinUrl,
          twitter: companyData.twitterUrl,
          facebook: companyData.facebookUrl,
          instagram: companyData.instagramUrl
        }
      }
      
      const response = await companyAPI.register(backendData)
      return response.data.data // Backend returns { success: true, data: company }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create company'
      console.error('Company registration failed:', error)
      return rejectWithValue(errorMessage)
    }
  }
)

export const updateCompany = createAsyncThunk(
  'company/update',
  async ({ data }, { rejectWithValue, dispatch }) => {
    try {
      console.log('Updating company with data:', data);
      
      // Map frontend form data to backend schema  
      const backendData = {
        company_name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        postal_code: data.zipCode,
        website: data.website,
        industry: data.industry,
        founded_date: data.foundedYear ? `${data.foundedYear}-01-01` : null,
        description: data.description,
        company_size: data.size,
        email: data.email,
        phone: data.phone,
        mission: data.mission,
        vision: data.vision,
        founding_story: data.foundingStory,
        social_links: {
          linkedin: data.linkedinUrl,
          twitter: data.twitterUrl,
          facebook: data.facebookUrl,
          instagram: data.instagramUrl
        }
      };
      
      console.log('Sending to API:', JSON.stringify(backendData, null, 2));
      
      const response = await companyAPI.updateProfile(backendData);
      console.log('Update response:', response.data);
      
      if (!response.data.success) {
        console.error('Update failed:', response.data);
        throw new Error(response.data.message || 'Failed to update company');
      }
      
      // Return the updated company data from the response
      // This should contain the updated company information
      return response.data.data;
      
    } catch (error) {
      console.error('Error in updateCompany:', {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });
      
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Failed to update company. Please try again.';
      
      return rejectWithValue(errorMessage);
    }
  }
)

export const fetchCompany = createAsyncThunk(
  'company/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await companyAPI.getProfile()
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch company')
    }
  }
)

export const uploadCompanyLogo = createAsyncThunk(
  'company/uploadLogo',
  async (file, { rejectWithValue }) => {
    try {
      console.log('Redux: Starting logo upload for file:', file.name, 'Size:', file.size, 'Type:', file.type);
      const response = await companyAPI.uploadLogo(file);
      console.log('Redux: Logo upload API response:', response.data);
      console.log('Redux: Logo upload data:', response.data.data);
      
      // Ensure we return the correct structure
      if (response.data.data && response.data.data.url) {
        console.log('Redux: Valid logo upload response, returning:', response.data.data);
        return response.data.data;
      } else if (response.data.url) {
        // Fallback if the structure is different
        console.log('Redux: Fallback logo upload response, returning:', response.data);
        return response.data;
      } else {
        console.error('Redux: Invalid logo upload response structure:', response.data);
        throw new Error('Invalid response structure from logo upload');
      }
    } catch (error) {
      console.error('Redux: Logo upload failed with full error object:', error);
      console.error('Redux: Error response data:', error.response?.data);
      console.error('Redux: Error message:', error.message);
      
      let errorMessage = 'Failed to upload logo';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message && error.message !== 'Network Error') {
        errorMessage = error.message;
      }
      
      console.error('Redux: Final error message for user:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
)

export const uploadCompanyBanner = createAsyncThunk(
  'company/uploadBanner',
  async (file, { rejectWithValue }) => {
    try {
      const response = await companyAPI.uploadBanner(file)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload banner')
    }
  }
)

export const editCompanyLogo = createAsyncThunk(
  'company/editLogo',
  async (file, { rejectWithValue }) => {
    try {
      console.log('Redux: Starting logo edit for file:', file ? file.name : 'null (delete)');
      const response = await companyAPI.editLogo(file);
      console.log('Redux: Logo edit API response:', response.data);
      
      // Ensure we return the correct structure
      if (response.data.data && response.data.data.url) {
        console.log('Redux: Valid logo edit response, returning:', response.data.data);
        return response.data.data;
      } else if (response.data.url) {
        // Fallback if the structure is different
        console.log('Redux: Fallback logo edit response, returning:', response.data);
        return response.data;
      } else {
        console.error('Redux: Invalid logo edit response structure:', response.data);
        throw new Error('Invalid response structure from logo edit');
      }
    } catch (error) {
      console.error('Redux: Logo edit failed:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to edit logo');
    }
  }
)

export const editCompanyBanner = createAsyncThunk(
  'company/editBanner',
  async (file, { rejectWithValue }) => {
    try {
      console.log('Redux: Starting banner edit for file:', file ? file.name : 'null (delete)');
      const response = await companyAPI.editBanner(file);
      console.log('Redux: Banner edit API response:', response.data);
      
      // Ensure we return the correct structure
      if (response.data.data && response.data.data.url) {
        console.log('Redux: Valid banner edit response, returning:', response.data.data);
        return response.data.data;
      } else if (response.data.url) {
        // Fallback if the structure is different
        console.log('Redux: Fallback banner edit response, returning:', response.data);
        return response.data;
      } else {
        console.error('Redux: Invalid banner edit response structure:', response.data);
        throw new Error('Invalid response structure from banner edit');
      }
    } catch (error) {
      console.error('Redux: Banner edit failed:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to edit banner');
    }
  }
)

const initialState = {
  currentCompany: null,
  companies: [],
  setupStep: 0,
  setupProgress: 0,
  isLoading: false,
  error: null,
  uploadingLogo: false,
  uploadingBanner: false,
  editingLogo: false,
  editingBanner: false,
}

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setSetupStep: (state, action) => {
      state.setupStep = action.payload
      // Calculate progress based on step
      const totalSteps = 4
      state.setupProgress = Math.round((action.payload / totalSteps) * 100)
    },
    setCompany: (state, action) => {
      state.currentCompany = action.payload
    },
    updateCompanyData: (state, action) => {
      state.currentCompany = { ...state.currentCompany, ...action.payload }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    setUploadingLogo: (state, action) => {
      state.uploadingLogo = action.payload
    },
    setUploadingBanner: (state, action) => {
      state.uploadingBanner = action.payload
    },
    setEditingLogo: (state, action) => {
      state.editingLogo = action.payload
    },
    setEditingBanner: (state, action) => {
      state.editingBanner = action.payload
    },
    resetCompanyState: (state) => {
      state.currentCompany = null
      state.setupStep = 0
      state.setupProgress = 0
      state.isLoading = false
      state.error = null
      state.uploadingLogo = false
      state.uploadingBanner = false
      state.editingLogo = false
      state.editingBanner = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Create company
      .addCase(createCompany.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentCompany = action.payload
        state.error = null
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Update company
      .addCase(updateCompany.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentCompany = action.payload
        state.error = null
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch company
      .addCase(fetchCompany.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentCompany = action.payload
        state.error = null
      })
      .addCase(fetchCompany.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Upload logo
      .addCase(uploadCompanyLogo.pending, (state) => {
        console.log('Redux: Logo upload pending');
        state.uploadingLogo = true
        state.error = null
      })
      .addCase(uploadCompanyLogo.fulfilled, (state, action) => {
        console.log('Redux: Logo upload fulfilled with payload:', action.payload);
        console.log('Redux: Current state before update:', JSON.stringify(state.currentCompany, null, 2));
        state.uploadingLogo = false
        if (state.currentCompany && action.payload) {
          console.log('Redux: Updating currentCompany.logo_url to:', action.payload.url);
          state.currentCompany.logo_url = action.payload.url
          console.log('Redux: Current state after update:', JSON.stringify(state.currentCompany, null, 2));
        } else {
          console.log('Redux: Error - currentCompany or payload missing:', {
            currentCompany: !!state.currentCompany,
            payload: action.payload
          });
        }
        state.error = null
      })
      .addCase(uploadCompanyLogo.rejected, (state, action) => {
        console.log('Redux: Logo upload rejected with error:', action.payload);
        state.uploadingLogo = false
        state.error = action.payload
      })
      // Upload banner
      .addCase(uploadCompanyBanner.pending, (state) => {
        state.uploadingBanner = true
        state.error = null
      })
      .addCase(uploadCompanyBanner.fulfilled, (state, action) => {
        state.uploadingBanner = false
        if (state.currentCompany) {
          state.currentCompany.banner_url = action.payload.url
        }
        state.error = null
      })
      .addCase(uploadCompanyBanner.rejected, (state, action) => {
        state.uploadingBanner = false
        state.error = action.payload
      })
      // Edit logo
      .addCase(editCompanyLogo.pending, (state) => {
        console.log('Redux: Logo edit pending');
        state.editingLogo = true
        state.error = null
      })
      .addCase(editCompanyLogo.fulfilled, (state, action) => {
        console.log('Redux: Logo edit fulfilled with payload:', action.payload);
        state.editingLogo = false
        if (state.currentCompany && action.payload) {
          console.log('Redux: Updating currentCompany.logo_url to:', action.payload.url);
          state.currentCompany.logo_url = action.payload.url
        }
        state.error = null
      })
      .addCase(editCompanyLogo.rejected, (state, action) => {
        console.log('Redux: Logo edit rejected with error:', action.payload);
        state.editingLogo = false
        state.error = action.payload
      })
      // Edit banner
      .addCase(editCompanyBanner.pending, (state) => {
        console.log('Redux: Banner edit pending');
        state.editingBanner = true
        state.error = null
      })
      .addCase(editCompanyBanner.fulfilled, (state, action) => {
        console.log('Redux: Banner edit fulfilled with payload:', action.payload);
        state.editingBanner = false
        if (state.currentCompany && action.payload) {
          console.log('Redux: Updating currentCompany.banner_url to:', action.payload.url);
          state.currentCompany.banner_url = action.payload.url
        }
        state.error = null
      })
      .addCase(editCompanyBanner.rejected, (state, action) => {
        console.log('Redux: Banner edit rejected with error:', action.payload);
        state.editingBanner = false
        state.error = action.payload
      })
  },
})

export const {
  setSetupStep,
  setCompany,
  updateCompanyData,
  setLoading,
  setError,
  clearError,
  setUploadingLogo,
  setUploadingBanner,
  setEditingLogo,
  setEditingBanner,
  resetCompanyState,
} = companySlice.actions

export default companySlice.reducer