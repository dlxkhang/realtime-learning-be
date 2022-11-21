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
        statusCode: 400,
        message: 'Wrong provided password',
    },
    INVALID_REFRESH_TOKEN: {
        statusCode: 401,
        message: 'Invalid refresh token',
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
}
