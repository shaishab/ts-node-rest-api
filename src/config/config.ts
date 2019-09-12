import { extend } from 'lodash';


const config = extend(
	require('./env/all'),
	require(`./env/${process.env.NODE_ENV}`) || {}
);

export default config;