const accessTokenCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 15 * 60 * 1000 // 15 minut
};

const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 kun
};

module.exports = {
    accessTokenCookieOptions,
    refreshTokenCookieOptions
};