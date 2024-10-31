/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import EmailSender from '../utils/email-sender.js';
import User from '../models/user-model.js';
import { decryptPin } from '../utils/encryption.js';

const pinReminder = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found with provided email.' });
        }

        const decryptedPin = decryptPin(user.pin);
        if (!decryptedPin) {
            throw new Error('Failed to decrypt PIN');
        }

        const emailOptions = {
            to: user.email,
            subject: 'Recordatorio de PIN',
            text: `Hola ${user.name},\n\nEs un gusto que cuentes con nosotros, tu PIN es: ${decryptedPin}`,
        };

        await EmailSender.send(emailOptions.to, emailOptions.subject, emailOptions.text);

        res.status(200).json({ message: 'Reminder email sent successfully.' });
    } catch (error) {
        res.status(500).json({ message: `Error sending reminder email: ${error.message}` });
    }
};

const sendNotificationEmail = async (user, bankAccount, parsedAmount, currentBalance) => {
    if (user && user.notifyme === 1) {
        const newBalance = currentBalance + parsedAmount;
        const emailOptions = {
            to: user.email,
            subject: 'Actualización de saldo de cuenta',
            text: `Hola ${user.name},\n\El saldo de tu cuenta ${bankAccount.account_number} ha sido actualizado.\n` +
                `Saldo anterior: ${currentBalance.toFixed(2)}\n` +
                `Monto: ${parsedAmount >= 0 ? `+${parsedAmount.toFixed(2)}` : parsedAmount.toFixed(2)}\n` +
                `Nuevo saldo: ${newBalance.toFixed(2)}.`,
        };
        await EmailSender.send(emailOptions.to, emailOptions.subject, emailOptions.text);
    }
};

export {
    pinReminder,
    sendNotificationEmail
};
