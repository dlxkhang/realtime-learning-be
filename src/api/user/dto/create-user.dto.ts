export interface CreateUserDTO {
    email: string
    fullName: string
    password?: string
    isVerified: boolean
    emailToken: string
}
