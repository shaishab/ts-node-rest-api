import mongoose from 'mongoose';


export class Database {
	// Initialize database pool
	public static async connect (dbUrl: string) {
		try {
			const options = { useNewUrlParser: true, useUnifiedTopology: true };
			let db = await mongoose.connect(dbUrl, options);
			console.log('Connection has been established to mongoDB :)')
			return db;
		} catch (error) {
			console.log('Failed to connect to the MongoDB server!!')
			// console.log('db error========', error);
			throw new Error(error.message);
		}
	}
}