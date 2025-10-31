export interface Job {
  id: string;
  title: string;
  slug: string;
  description?: string;
  location: string;
  salary?: string;
  status: 'active' | 'archived';
  tags: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
  applicants?: number; // Add this line
}