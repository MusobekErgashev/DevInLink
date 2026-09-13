const accessTokenCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
    maxAge: 15 * 60 * 1000 // 15 minut
};

const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 kun
};

module.exports = {
    accessTokenCookieOptions,
    refreshTokenCookieOptions
};