const isProduction = process.env.NODE_ENV === 'production';

const accessTokenCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 15 * 60 * 1000 // 15 minut
};

const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 kun
};

module.exports = {
    accessTokenCookieOptions,
    refreshTokenCookieOptions
};