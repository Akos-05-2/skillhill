export interface Material {
  id: string;
  title: string;
  description?: string;
  fileType: string;
  fileUrl?: string;
}

export interface Module {
  id: string;
  name: string;
  description?: string;
  materials: Material[];
  title?: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  isActive?: boolean;
  modules?: Module[];
  category?: {
    id: string;
    category_name: string;
  };
} 