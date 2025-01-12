export 
interface User {
    id: number
    name: string
    email: string
    mobile: string
    rdate: string
    status: string
    ccode: string
    code: string
    refercode: string | null
    wallet: string
    gender: string
    lats: string
    longs: string
    profile_bio: string
    profile_pic: string | null
    birth_date: string
    search_preference: string
    radius_search: string
    relation_goal: string
    interest: string
    language: string
    religion: string
    other_pic: string
    plan_id: string
    plan_start_date: string | null
    plan_end_date: string | null
    is_subscribe: string
    history_id: string
    planName?: string
    height: string
    identity_picture: string | null
    is_verify: string
    direct_audio: string
    direct_video: string
    direct_chat: string
    createdAt: string
    updatedAt: string
}