/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import BankAccount from '../models/bank-account-model.js';
import AccountTier from '../models/account-tier-model.js';
import Currency from '../models/currency-model.js';
import sequelize from '../../config/database-connection.js';

const getLinkedAccounts = async (req, res) => {
    const linkedAccounts = req.linkedAccounts;
    if (!Array.isArray(linkedAccounts) || linkedAccounts.length === 0) {
        return res.status(400).json({ message: 'Account numbers array is required.' });
    }

    try {
        const bank_accounts = await BankAccount.findAll({
            where: {
                account_number: linkedAccounts,
                is_delete: 0
            },
            include: [
                { model: AccountTier, as: 'tier', attributes: [] },
                { model: Currency, as: 'currency', attributes: [] }
            ],
            attributes: ['account_name', 'account_number', 'balance', 'creation_date',
                [sequelize.col('tier.tier_name'), 'account_tier'],
                [sequelize.col('currency.code'), 'currency_code']
            ]
        });

        if (bank_accounts.length === 0) {
            return res.status(404).json({ message: 'No accounts found for the provided numbers.' });
        }

        res.status(200).json({ bank_accounts });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching accounts: ' + error.message });
    }
};

const updateAccountBalance = async (req, res) => {
    const { account_number, amount } = req.body;
    const tokenLinkedAccounts = req.linkedAccounts;

    const transaction = await sequelize.transaction();

    try {
        if (!/^-?\d+(\.\d+)?$/.test(amount)) {
            return res.status(400).json({ message: 'Invalid amount format. Please enter a valid number.' });
        }

        if (tokenLinkedAccounts) {
            if (!tokenLinkedAccounts.includes(account_number)) {
                return res.status(400).json({ message: 'Account is not linked.' });
            }
        }

        const parsedAmount = parseFloat(amount);
        const bankAccount = await BankAccount.findOne({
            where: { account_number, is_delete: 0 }
        });

        if (!bankAccount) {
            return res.status(404).json({ message: 'Account not found.' });
        }

        const currentBalance = parseFloat(bankAccount.balance);

        if (isNaN(currentBalance)) {
            return res.status(500).json({ message: 'Error processing current balance.' });
        }

        if (parsedAmount < 0 && currentBalance + parsedAmount < 0) {
            return res.status(400).json({ message: 'Insufficient balance.' });
        }

        bankAccount.balance = currentBalance + parsedAmount;
        await bankAccount.save({ transaction });

        await transaction.commit();
        res.status(200).json({ message: 'Balance updated successfully.', new_balance: bankAccount.balance });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Error updating balance: ' + error.message });
    }
};

export {
    getLinkedAccounts,
    updateAccountBalance
};
