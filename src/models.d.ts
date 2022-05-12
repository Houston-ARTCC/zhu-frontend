export interface TrainingRequest {
    id: number
    start: Date
    end: Date
    type: number
    level: number
    remarks: string
}
export interface UserTrainingRequests {
    user: BasicUser
    requests: TrainingRequest[]
    last_session: Date | null
}
export interface Rating {
    short: string
    long: string
}
export interface BasicUser {
    cid: number
    first_name: string
    last_name: string
    initials: string
    profile: string
    email?: string
}
