export interface Plan {
  id: string;
  title: string;
  amt: string;
  day_limit: string;
  description?: string;
  filterInclude?: boolean;
  audioVideo?: boolean;
  directChat?: boolean;
  chat?: boolean;
  likeMenu?: boolean;
  status: string;
}