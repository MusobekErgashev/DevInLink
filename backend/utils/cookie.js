const accessTokenCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 15 * 60 * 1000 // 15 minut
};

const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 kun
};

module.exports = {
    accessTokenCookieOptions,
    refreshTokenCookieOptions
};