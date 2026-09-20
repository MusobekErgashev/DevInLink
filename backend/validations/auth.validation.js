const Joi = require('joi');

class AuthValidate {
    register = Joi.object({
        first_name: Joi.string().required().empty('').messages({
            'string.base': 'ism matn bo\'lishi kerak',
            'any.required': 'ism kiritilishi shart',
            'empty': 'ism kiritilishi shart'
        }),
        last_name: Joi.string().required().empty('').messages({
            'string.base': 'familya matn bo\'lishi kerak',
            'any.required': 'familya kiritilishi shart',
            'empty': 'familiya kiritilishi shart'
        }),
        username: Joi.string().pattern(/^[^0-9]+$/).min(5).required().empty('').messages({
            'string.base': 'username matn bo\'lishi kerak',
            'string.pattern.base': 'username tarkibida raqamlar bo\'lishi mumkin emas',
            'string.min': 'username kamida 5 ta belgidan iborat bo\'lishi kerak',
            'any.required': 'username kiritilishi shart',
            'empty': 'username kiritilishi shart'
        }),
        email: Joi.string().email().required().empty('').messages({
            'string.email': 'yaroqli email manzilini kiriting',
            'any.required': 'email kiritilishi shart',
            'empty': 'email kiritilishi shart'
        }), 
        password_hash: Joi.string().min(8).required().empty('').messages({
            'string.min': 'parol kamida 8 ta belgidan iborat bo\'lishi kerak',
            'any.required': 'parol kiritilishi shart',
            'empty': 'parol kiritilishi shart'
        })
    });

    login = Joi.object({
        username: Joi.string().pattern(/^[^0-9]+$/).min(5).messages({
            'string.pattern.base': 'username tarkibida raqamlar bo\'lishi mumkin emas',
            'string.min': 'username kamida 5 ta belgidan iborat bo\'lishi kerak',
        }),
        email: Joi.string().email().messages({
            'string.email': 'yaroqli email manzilini kiriting',
        }),
        password_hash: Joi.string().min(8).required().empty('').messages({
            'string.min': 'parol kamida 8 ta belgidan iborat bo\'lishi kerak',
            'any.required': 'parol kiritilishi shart',
            'empty': 'parol kiritilishi shart'
        })
    }).xor('username', 'email').messages({
        'object.xor': 'Login qilish uchun yoki username, yoki email kiriting (ikkalasi birga emas)'
    });

    changePassword = Joi.object({
        oldPassword: Joi.string().min(8).required().empty('').messages({
            'string.min': 'Eski parol kamida 8 ta belgidan iborat bo\'lishi kerak',
            'any.required': 'Eski parol kiritilishi shart',
            'empty': 'Eski parol kiritilishi shart'
        }),
        newPassword: Joi.string().min(8).required().empty('').messages({
            'string.min': 'Yangi parol kamida 8 ta belgidan iborat bo\'lishi kerak',
            'any.required': 'Yangi parol kiritilishi shart',
            'empty': 'Yangi parol kiritilishi shart'
        })
    });
}

module.exports = new AuthValidate();
