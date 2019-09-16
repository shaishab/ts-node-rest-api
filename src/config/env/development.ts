import path from 'path';
module.exports = {
	app: {
		title: 'ts node rest api',
		baseUrl: '/tsnode/api/',
		version: 'v1.0'
	},
	api: {
		test: 'http://localhost:6062/test/api/v1.0'
	},
	database: {
		url: 'mongodb://localhost/ts-node-rest-api'
	},
	session: {
		secret: 'abcd#_RWU',
		tokenEncryptionKey: 'dfdfsd&adsfsdfsrew', // length must be 16
		tokenLife: 10, //in minute
		issuer: 'node',
		subject: 'node@users',
		audience: 'https://tsnode/',
		algorithm: 'RS256', // RSASSA [ "RS256", "RS384", "RS512" ]
		rsaPrivateKey: path.join(__dirname, '../keys/private.key'),
		rsaPublicKey: path.join(__dirname, '../keys/public.key')
	},
};