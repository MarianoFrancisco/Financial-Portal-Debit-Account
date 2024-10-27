/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import User from '../models/user-model.js';
import BankAccount from '../models/bank-account-model.js';
import TokenLinkedApi from '../models/token-linked-api-model.js';
import jwt from 'jsonwebtoken';
import sequelize from '../../config/database-connection.js';

const createLinkAccount = async (req, res) => {
    const { account_number, pin } = req.body;
    const transaction = await sequelize.transaction();

    try {
        const bankAccount = await findUserAndBankAccount(account_number, pin);
        const linkedAccounts = [bankAccount.account_number];
        const payload = { linkedAccounts };
        const newToken = jwt.sign(payload, process.env.API_ENCRIPTION_KEY);

        await TokenLinkedApi.create({ token: newToken }, { transaction });
        await transaction.commit();
        res.status(201).json({ token: newToken });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Error linking the account: ' + error.message });
    }
};

const updateLinkAccount = async (req, res) => {
    const { account_number, pin } = req.body;
    const tokenLinkedAccounts = req.linkedAccounts;
    const tokenID = req.tokenID;
    const transaction = await sequelize.transaction();

    try {

        const bankAccount = await findUserAndBankAccount(account_number, pin);

        let linkedAccounts = tokenLinkedAccounts || [];

        if (linkedAccounts.includes(bankAccount.account_number)) {
            await transaction.commit();
            return res.status(400).json({ message: 'Account is already linked.' });
        }

        linkedAccounts.push(bankAccount.account_number);

        const newPayload = { linkedAccounts };
        const newToken = jwt.sign(newPayload, process.env.API_ENCRIPTION_KEY);

        await TokenLinkedApi.update({ token: newToken }, { where: { id: tokenID }, transaction });

        await transaction.commit();
        res.status(200).json({ token: newToken });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Error updating the account: ' + error.message });
    }
};

const findUserAndBankAccount = async (account_number, pin) => {
    const bankAccount = await BankAccount.findOne({ where: { account_number } });
    if (!bankAccount) {
        throw new Error('Bank account not found.');
    }

    const user = await User.findOne({ where: { id: bankAccount.user_id } });
    if (!user) {
        throw new Error('User not found.');
    }

    const isMatch = await user.matchPassword(pin);
    if (!isMatch) {
        throw new Error('Incorrect PIN.');
    }

    return bankAccount;
};
const deleteLinkAccount = async (req, res) => {
    const { account_number } = req.body;
    const tokenLinkedAccounts = req.linkedAccounts;
    const tokenID = req.tokenID;

    const transaction = await sequelize.transaction();

    try {
        let linkedAccounts = tokenLinkedAccounts || [];

        if (!linkedAccounts.includes(account_number)) {
            return res.status(400).json({ message: 'Account is not linked.' });
        }

        linkedAccounts = linkedAccounts.filter(acc => acc !== account_number);

        const newPayload = { linkedAccounts };
        const newToken = jwt.sign(newPayload, process.env.API_ENCRIPTION_KEY);

        await TokenLinkedApi.update({ token: newToken }, { where: { id: tokenID }, transaction });

        await transaction.commit();
        res.status(200).json({ token: newToken });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Error unlinking the account: ' + error.message });
    }
};

export {
    createLinkAccount,
    updateLinkAccount,
    deleteLinkAccount
};