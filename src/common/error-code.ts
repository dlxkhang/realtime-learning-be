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
