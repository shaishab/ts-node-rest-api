import { randomBytes, createCipheriv, createDecipheriv, createHash } from 'crypto';

export default class CryptoHelper {

	private getHashedKey(password: string): Buffer {
		return createHash('sha256').update(password).digest();
	}

	public encrypt(text: string, encryptionKey: string): Buffer {
		const iv = randomBytes(16);
		const key = this.getHashedKey(encryptionKey);
		const cipher = createCipheriv('aes256', key, iv);
		let cipherText = Buffer.concat([cipher.update(text, 'binary'), cipher.final()]);
		return Buffer.concat([iv, cipherText]);
	}

	public decrypt(text: any, encryptionKey: string): Buffer {
		text = Buffer.from(text);
		let iv = text.slice(0, 16);
		text = text.slice(16);

		const key = this.getHashedKey(encryptionKey);
		const decipher = createDecipheriv('aes256', key, iv);
		return Buffer.concat([decipher.update(text, 'binary'), decipher.final()]);
	}
}