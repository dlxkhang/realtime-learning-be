import { ENV } from '../common/env'

export const generateEmailInvitationLink = (invitationId: string): string => {
    return ENV.APP_BASE_URL + `/invitation/${invitationId}`
}
