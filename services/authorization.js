/* eslint-disable eqeqeq */
/* eslint-disable no-unreachable */
const secret = process.env.JWT_SECRET
const expressJwt = require('express-jwt')
const { userModule: { getUser }, adminModule: { getAdmin }  } = require('../models')
module.exports = authorize

function authorize (roles = []) {
	if (typeof roles == 'string') {
		roles = [roles]
	}
	return [
		expressJwt({ secret: secret, algorithms: ['HS256'] }),

		(req, res, next) => {
			if (roles.length && !roles.includes(req.user.roles)) {
				return res.status(401).json({ message: 'Unauthorized' })
			}
			switch (req.user.roles) {
			case 'User':
				getUser({Email:req.user.Email}).then(
					user => {
						if (user) {
							req.user = user
							req.userType = 'User'
							next()
						} else {
							return res
								.status(404)
								.json({ message: 'User Not Found' })
						}
					}
				)
				break
			case 'Admin':
				getAdmin({Email: req.user.Email}).then(
					user => {
						if (user) {
							req.user = user
							req.userType = 'Admin'
							next()
						} else {
							return res
								.status(404)
								.json({ message: 'User Not Found' })
						}
					}
				)
				break
			default:
				return res.status(404).json({ message: 'User Not Found' })
				break
			}
		}
	]
}
