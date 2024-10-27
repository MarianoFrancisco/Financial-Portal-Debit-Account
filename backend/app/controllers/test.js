import crypto from 'crypto';

// Genera una clave aleatoria de 32 bytes (64 caracteres hexadecimales)
const randomKey = crypto.randomBytes(32).toString('hex');
console.log(randomKey);