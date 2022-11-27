export const USER_ERROR_CODE = {
    EMAIL_ALREADY_EXIST: {
        statusCode: 409,
        message: 'Email already exist',
    },
    EMAIL_NOT_FOUND: {
        statusCode: 400,
        message: 'Email not found',
    },
    ID_NOT_FOUND: {
        statusCode: 400,
        message: 'User ID not found',
    },
}

export const AUTH_ERROR_CODE = {
    WRONG_PROVIDED_PASSWORD: {
        statusCode: 401,
        message: 'Wrong provided password',
    },
    INVALID_REFRESH_TOKEN: {
        statusCode: 401,
        message: 'Invalid refresh token',
    },
    INVALID_EMAIL_TOKEN: {
        statusCode: 409,
        message: 'Invalid email token',
    },
}

export const GROUP_ERROR_CODE = {
    GROUP_NOT_FOUND: {
        statusCode: 400,
        message: 'Group not found',
    },
    GROUP_ALREADY_EXIST: {
        statusCode: 409,
        message: 'Group already exist',
    },
    MISSING_GROUP_NAME: {
        statusCode: 400,
        message: 'Missing group name',
    },
    MISSING_GROUP_OWNER: {
        statusCode: 400,
        message: 'Missing group owner',
    },
    MEMBER_ALREADY_IN_GROUP: {
        statusCode: 400,
        message: 'Member already in group',
    },
    MEMBER_NOT_IN_GROUP: {
        statusCode: 400,
        message: 'Member not in group',
    },
    CO_OWNER_ALREADY_IN_GROUP: {
        statusCode: 400,
        message: 'Co-owner already in group',
    },
    CO_OWNER_NOT_IN_GROUP: {
        statusCode: 400,
        message: 'Co-owner not in group',
    },
    NOT_HAVING_PERMISSION: {
        statusCode: 400,
        message: 'Not having permission',
    },
}

export const INVITATION_ERROR_CODE = {
    INVITER_NOT_FOUND: {
        statusCode: 400,
        message: 'Inviter not found',
    },
    GROUP_ID_NOT_FOUND: {
        statusCode: 400,
        message: 'Invalid group ID',
    },
    UNAUTHORIZED_INVITER: {
        statusCode: 401,
        message: 'Unauthorized inviter',
    },
    INVITATION_ID_NOT_FOUND: {
        statusCode: 400,
        message: 'Invitation ID not found',
    },
    INVITEE_NOT_FOUND: {
        statusCode: 400,
        message: 'Invitee not found',
    },
    INVALID_INVITEE_EMAIL: {
        statusCode: 400,
        message: 'Invalid invitee email',
    },
    INVITER_DUPLICATED: {
        statusCode: 400,
        message: 'Invitee cannot be inviter',
    },
    INVITEE_DUPLICATED: {
        statusCode: 400,
        message: 'Invitee already a member of this group',
    },
}

export const GENERAL_ERROR_CODE = {
    UNKNOWN_ERROR: {
        statusCode: 400,
        message: 'Bad request',
    },
    MAIL_SERVICE_ERROR: {
        statusCode: 400,
        message: 'Mail service error',
    },
}
