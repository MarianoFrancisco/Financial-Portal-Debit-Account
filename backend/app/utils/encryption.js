/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const secretKey = process.env.ENCRYPTION_KEY
    ? Buffer.from(process.env.ENCRYPTION_KEY, 'hex')
    : crypto.randomBytes(32);
const ivLength = 16;

export function encryptPin(pin) {
    if (!pin) throw new Error('No pin provided for encryption.');
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(pin, 'utf-8'), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptPin(encryptedPin) {
    const [ivHex, encryptedText] = encryptedPin.split(':');
    if (!ivHex || !encryptedText) throw new Error('Invalid encrypted pin format.');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText, 'hex'), decipher.final()]);
    return decrypted.toString('utf-8');
}