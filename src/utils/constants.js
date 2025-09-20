// API Configuration
export const API_BASE_URL = 'http://localhost:8000'; // Change to your FastAPI server URL
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  
  // Patients
  PATIENT_PROFILE: '/api/patients/profile',
  AVAILABLE_DOCTORS: '/api/patients/doctors/available',
  INSURANCE_RECOMMENDATIONS: '/api/patients/insurance-recommendations',
  GOVERNMENT_SCHEMES: '/api/patients/government-schemes',
  
  // Pharmacy
  MEDICINES: '/api/pharmacy/medicines',
  MEDICINE_DETAILS: '/api/pharmacy/medicines',
  
  // AI Services
  ANALYZE_PRESCRIPTION: '/api/ai/prescription/analyze',
  DAILY_HEALTH_TIP: '/api/ai/health-tip/daily',
  AI_CHAT: '/api/ai/chat',
  
  // Social
  POSTS: '/api/social/posts',
  CREATE_POST: '/api/social/posts',
  LIKE_POST: '/api/social/posts'
};

// Colors
export const COLORS = {
  primary: '#2E8B57',
  secondary: '#32CD32',
  accent: '#FF6347',
  background: '#F8F9FA',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#6C757D',
  lightGray: '#E9ECEF',
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#17A2B8'
};

// User Types
export const USER_TYPES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  PHARMACY: 'pharmacy'
};