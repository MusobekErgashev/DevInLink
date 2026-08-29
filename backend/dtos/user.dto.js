class UserDto {
    constructor(user) {
        this.id = user.id
        this.username = user.username
        this.email = user.email
        this.firstName = user.first_name
        this.lastName = user.last_name
        this.headline = user.headline
        this.about = user.about
        this.birthday = user.birthday
        this.phone = user.phone
        this.location = user.location
        this.job_title = user.job_title
        this.github_url = user.github_url
        this.linkedin_url = user.linkedin_url
        this.instagram_url = user.instagram_url
        this.telegram_url = user.telegram_url
        this.youtube_url = user.youtube_url
        this.website_url = user.website_url
        this.total_experience_years = user.total_experience_years
        this.accaunt_status = user.accaunt_status
        this.views_count = user.views_count
        this.avatar = user.avatar
        this.viewsCount = user.views_count
        this.createdAt = user.created_at
    }

    toResponse() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            headline: this.headline,
            about: this.about,
            birthday: this.birthday,
            phone: this.phone,
            location: this.location,
            job_title: this.job_title,
            github_url: this.github_url,
            linkedin_url: this.linkedin_url,
            instagram_url: this.instagram_url,
            telegram_url: this.telegram_url,
            youtube_url: this.youtube_url,
            website_url: this.website_url,
            total_experience_years: this.total_experience_years,
            accaunt_status: this.accaunt_status,
            views_count: this.views_count,
            avatar: this.avatar,
            viewsCount: this.viewsCount,
            createdAt: this.createdAt
        }
    }
}

class UserAuthDto {
    constructor(user) {
        this.id = user.id
        this.username = user.username
        this.email = user.email
        this.password_hash = user.password_hash
    }

    toResponse(){
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            password_hash: this.password_hash
        }
    }
}

const toUserResponseDto = (user) => new UserDto(user).toResponse()
const toUserAuthDto = (user) => new UserAuthDto(user).toResponse()

module.exports = { toUserResponseDto, toUserAuthDto }