const Joi = require('joi');

class AuthValidate {
    register = Joi.object({
        username: Joi.string().pattern(/^[^0-9]+$/).min(5).required().messages({
            'string.base': 'username matn bo\'lishi kerak',
            'string.pattern.base': 'username tarkibida raqamlar bo\'lishi mumkin emas',
            'string.min': 'username kamida 5 ta belgidan iborat bo\'lishi kerak',
            'any.required': 'username kiritilishi shart',
        }),
        first_name: Joi.string().required().messages({
            'string.base': 'ism matn bo\'lishi kerak',
            'any.required': 'ism kiritilishi shart'
        }),
        last_name: Joi.string().required().messages({
            'string.base': 'familya matn bo\'lishi kerak',
            'any.required': 'familya kiritilishi shart'
        }),
        email: Joi.string().email().required().messages({
            'string.email': 'yaroqli email manzilini kiriting',
            'any.required': 'email kiritilishi shart'
        }), 
        password_hash: Joi.string().min(8).required().messages({
            'string.min': 'parol kamida 8 ta belgidan iborat bo\'lishi kerak',
            'any.required': 'parol kiritilishi shart'
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
        password_hash: Joi.string().min(8).required().messages({
            'string.min': 'parol kamida 8 ta belgidan iborat bo\'lishi kerak',
            'any.required': 'parol kiritilishi shart'
        })
    }).xor('username', 'email').messages({
        'object.xor': 'Login qilish uchun yoki username, yoki email kiriting (ikkalasi birga emas)'
    });
}

module.exports = new AuthValidate();
