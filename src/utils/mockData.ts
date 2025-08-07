import { Material, MaterialsResponse, Site } from '@/types/material';

export const mockSite: Site = {
  id: 2,
  business_id: 1,
  user_id: null,
  site_name: "Shivaji - Srirampur colony",
  address: "Bombay press road",
  currency: "INR",
  estimated_budget: "229999.00",
  location: "india",
  progress: 1,
  total_spent: "100.00",
  created_at: "2025-07-24T19:14:50.000000Z",
  updated_at: "2025-07-24T19:14:50.000000Z",
  deleted_at: null
};

export const mockMaterials: Material[] = [
  {
    id: 2,
    site_id: 2,
    material_name: "Red Bricks",
    category_id: 1,
    quantity: "100.00",
    unit: "bags",
    amount_spent: "12000.00",
    date_added: "2025-07-26T00:00:00.000000Z",
    created_at: "2025-07-29T10:00:34.000000Z",
    updated_at: "2025-07-29T10:00:34.000000Z",
    site: mockSite
  },
  {
    id: 3,
    site_id: 2,
    material_name: "Cement",
    category_id: 1,
    quantity: "50.00",
    unit: "bags",
    amount_spent: "15000.00",
    date_added: "2025-07-25T00:00:00.000000Z",
    created_at: "2025-07-29T10:00:34.000000Z",
    updated_at: "2025-07-29T10:00:34.000000Z",
    site: mockSite
  },
  {
    id: 4,
    site_id: 2,
    material_name: "TMT Steel",
    category_id: 2,
    quantity: "1000.00",
    unit: "kg",
    amount_spent: "65000.00",
    date_added: "2025-07-24T00:00:00.000000Z",
    created_at: "2025-07-29T10:00:34.000000Z",
    updated_at: "2025-07-29T10:00:34.000000Z",
    site: mockSite
  }
];

export const mockMaterialsResponse: MaterialsResponse = {
  status: true,
  message: "Materials fetched successfully",
  data: mockMaterials
};
