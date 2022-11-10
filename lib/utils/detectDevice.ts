import { UAParser } from 'ua-parser-js'

export function detectMobile(req?: any) {
	let userAgent

	if (req) {
		userAgent = UAParser(req.headers['user-agent'] || '')
	} else {
		userAgent = new UAParser().getResult()
	}

	return userAgent?.device?.type === 'mobile'
}
