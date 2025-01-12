export interface Plan {
  id: string
  title: string
  amount: string
  dayLimit: string
  filterInclude: boolean
  directChat: boolean
  chat: boolean
  likeMenu: boolean
  audioVideo: boolean
  status: "1" | "0"
  description: string
}