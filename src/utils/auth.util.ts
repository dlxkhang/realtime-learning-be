export const randomPassword = (): string => {
    const lowerChars = 'qwertyuiopasdfghjklzxcvbnm',
        upperChars = 'QWERTYUIOPASDFGHJKLZXCVBNM',
        numChars = '123456789',
        length = 8
    const len = Math.ceil(length / 2)
    let password = ''

    for (let i = 0; i < len - 1; i++) {
        password += lowerChars.charAt(Math.floor(Math.random() * lowerChars.length))
        password += upperChars.charAt(Math.floor(Math.random() * upperChars.length))
        password += numChars.charAt(Math.floor(Math.random() * numChars.length))
    }

    return password
        .split('')
        .sort(() => 0.5 - Math.random())
        .join('')
}
