export interface Project {
  id: string;
  title: string;
  description: string;
  poster_url: string | null;
  live_url: string | null;
  repo_url: string | null;
  tags: string[];
  sort_order: number;
  created_at: string;
}

export interface ProjectInput {
  title: string;
  description: string;
  poster_url: string | null;
  live_url: string | null;
  repo_url: string | null;
  tags: string[];
  sort_order: number;
}
