import api from '@/lib/api';

export interface Member {
  id: number;
  user_role_id: number;
  added_by: number | null;
  user_role: string | null;
  first_name: string | null;
  last_name: string | null;
  name: string;
  email: string;
  business_name: string | null;
  phone_number_prefix: string | null;
  phone_number_country_code: string | null;
  phone_number: string;
  address: string | null;
  gender: string | null;
  is_active: number;
  is_deleted: number;
  image: string;
  social_type: string | null;
  social_id: string | null;
  forgot_password_validate_string: string | null;
  verification_code: string | null;
  verification_code_sent_time: string | null;
  is_verified: number;
  verified_by_admin: number;
  language: string | null;
  push_notification: number;
  documents_front: string | null;
  documents_back: string | null;
  created_at: string;
  updated_at: string;
}

export interface MembersResponse {
  success: boolean;
  data: Member[];
}

export const membersService = {
  // Fetch all members
  getMembers: async (): Promise<MembersResponse> => {
    try {
      const response = await api.get('/member');
      
      return response.data;
      
    } catch (error: any) {
      console.error('Members API Error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to fetch members';
      
      throw new Error(errorMessage);
    }
  }
};
