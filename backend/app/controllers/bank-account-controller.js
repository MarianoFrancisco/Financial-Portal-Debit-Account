/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import BankAccount from '../models/bank-account-model.js';
import AccountTier from '../models/account-tier-model.js';
import Currency from '../models/currency-model.js';
import User from '../models/user-model.js';
import { convertToGTQ, getExchangeRateForCurrency } from './exchange-rate-controller.js';
import sequelize from '../../config/database-connection.js';
import { sendNotificationEmail } from './email-sender-controller.js';
import { registerTransaction } from '../controllers/transaction-controller.js';
import generateUniqueAccountNumber from '../utils/generate-account-number.js';

const getLinkedAccounts = async (req, res) => {
    const linkedAccounts = req.linkedAccounts;
    if (!Array.isArray(linkedAccounts) || linkedAccounts.length === 0) {
        return res.status(400).json({ message: 'Account numbers array is required.' });
    }

    try {
        const bank_accounts = await BankAccount.findAll({
            where: {
                account_number: linkedAccounts,
                close: 0
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

const getAllBankAccounts = async (req, res) => {
    try {
        const bankAccounts = await BankAccount.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['username'],
                },
                {
                    model: AccountTier,
                    as: 'tier',
                    attributes: ['tier_name'],
                },
                {
                    model: Currency,
                    as: 'currency',
                    attributes: ['name'],
                }
            ],
            attributes: [
                'id',
                'account_name',
                'account_number',
                'balance',
                'creation_date',
                'close'
            ],
        });

        if (!bankAccounts || bankAccounts.length === 0) {
            return res.status(404).json({ message: 'No bank accounts found.' });
        }

        const response = bankAccounts.map(account => ({
            id: account.id,
            account_name: account.account_name,
            account_number: account.account_number,
            balance: account.balance,
            creation_date: account.creation_date,
            close: account.close,
            username: account.user ? account.user.username : null,
            tier_name: account.tier ? account.tier.tier_name : null,
            currency_name: account.currency ? account.currency.name : null
        }));

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: `Error retrieving bank accounts: ${error.message}` });
    }
};

const getUserAccounts = async (req, res) => {
    const userId = req.user_id;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const bank_accounts = await BankAccount.findAll({
            where: {
                user_id: userId,
                close: 0
            },
            include: [
                { model: AccountTier, as: 'tier', attributes: [] },
                { model: Currency, as: 'currency', attributes: [] }
            ],
            attributes: [
                'id',
                'account_name',
                'account_number',
                'balance',
                'creation_date',
                [sequelize.col('tier.tier_name'), 'account_tier'],
                [sequelize.col('currency.code'), 'currency_code']
            ]
        });

        if (bank_accounts.length === 0) {
            return res.status(404).json({ message: 'No accounts found for the user.' });
        }

        res.status(200).json(bank_accounts);
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
        const bankAccount = await BankAccount.findOne({
            where: { account_number, close: 0 }
        });

        if (!bankAccount) {
            return res.status(404).json({ message: 'Account not found.' });
        }

        let parsedAmount = parseFloat(amount);

        if (tokenLinkedAccounts && !tokenLinkedAccounts.includes(account_number)) {
            return res.status(400).json({ message: 'Account is not linked.' });
        } else if (tokenLinkedAccounts) {
            parsedAmount = await convertToGTQ(parsedAmount, bankAccount.currency_id);
        }

        const currentBalance = parseFloat(bankAccount.balance);

        if (isNaN(currentBalance)) {
            return res.status(500).json({ message: 'Error processing current balance.' });
        }

        if (parsedAmount < 0 && currentBalance + parsedAmount < 0) {
            return res.status(400).json({ message: 'Insufficient balance.' });
        }
        const newBalance = currentBalance + parsedAmount;
        await sequelize.query(
            'UPDATE bank_accounts SET balance = :newBalance WHERE account_number = :account_number AND close = 0',
            {
                replacements: { newBalance, account_number },
                type: sequelize.QueryTypes.UPDATE,
                transaction
            }
        );
        //bankAccount.balance = currentBalance + parsedAmount;
        //await bankAccount.save({ transaction });

        const transactionType = parsedAmount >= 0 ? 'Income' : 'Expense';

        await registerTransaction(bankAccount.id, transactionType, parsedAmount, transaction);

        const user = await User.findOne({ where: { id: bankAccount.user_id } });
        await sendNotificationEmail(user, bankAccount, parsedAmount, currentBalance);

        await transaction.commit();
        res.status(200).json({ message: 'Balance updated successfully.', newBalance });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Error updating balance: ' + error.message });
    }
};

const createBankAccount = async (req, res) => {
    const { username, account_tier_id, balance: balanceInput } = req.body;

    const balance = parseFloat(balanceInput);
    if (isNaN(balance)) {
        return res.status(400).json({ message: 'Invalid balance format. Please enter a valid number.' });
    }

    const transaction = await sequelize.transaction();

    try {
        const user = await User.findOne({ where: { username }, transaction });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const tiers = await AccountTier.findAll({ transaction });
        const selectedTier = tiers.find(tier => tier.id === parseInt(account_tier_id, 10));
        if (!selectedTier) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Invalid account tier selected.' });
        }

        const openingFee = selectedTier.opening_fee;

        if (balance < openingFee) {
            await transaction.rollback();
            return res.status(400).json({ message: `Insufficient funds to open a ${selectedTier.tier_name} account. Required: ${openingFee}` });
        }

        const accountName = `${user.username}.${selectedTier.tier_name}@${process.env.EMAIL_PREFIX}.com`;

        const newBankAccount = await BankAccount.create({
            account_name: accountName,
            account_number: await generateUniqueAccountNumber(),
            user_id: user.id,
            account_tier_id: selectedTier.id,
            currency_id: selectedTier.id,
            balance: balance - openingFee
        }, { transaction });

        await transaction.commit();

        res.status(201).json({ message: 'Bank account created successfully.', account: newBankAccount });
    } catch (error) {
        await transaction.rollback();
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Error: Account tier already exists. Please try again with a different tier.' });
        }
        res.status(500).json({ message: 'Error creating bank account: ' + error.message });
    }
};

const changeAccountType = async (req, res) => {
    const { username, old_account_id, new_account_tier_id, keep_old_account } = req.body;

    const transaction = await sequelize.transaction();

    try {

        const user = await User.findOne({
            where: { username },
            attributes: ['id']
        });

        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ message: 'User not found.' });
        }

        const user_id = user.id;
        const oldAccount = await BankAccount.findOne({
            where: { id: old_account_id, user_id: user_id},
            include: [{
                model: User,
                as: 'user',
                attributes: ['username']
            }],
            transaction
        });

        if (!oldAccount) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Old account not found.' });
        }

        const newTier = await AccountTier.findByPk(new_account_tier_id, { transaction });
        if (!newTier) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Invalid new account tier selected.' });

        }

        const exchangeRate = await getExchangeRateForCurrency(oldAccount.currency_id, newTier.id);

        const convertedBalance = oldAccount.balance * exchangeRate;

        const newAccount = await BankAccount.create({
            account_name: `${oldAccount.user.username}.${newTier.tier_name}@${process.env.EMAIL_PREFIX}.com`,
            account_number: await generateUniqueAccountNumber(),
            user_id: user_id,
            account_tier_id: newTier.id,
            currency_id: newTier.id,
            balance: convertedBalance
        }, { transaction });

        await sequelize.query(
            'UPDATE bank_accounts SET balance = 0, close = CASE WHEN :keep_old_account = false THEN 1 ELSE close END WHERE account_number = :account_number',
            {
                replacements: { account_number: oldAccount.account_number, keep_old_account },
                type: sequelize.QueryTypes.UPDATE,
                transaction
            }
        );
        //oldAccount.balance = 0;
        //if (!keep_old_account) {
        //    oldAccount.close = 1;
        //}
        //await oldAccount.save({ transaction });

        await transaction.commit();
        res.status(201).json({ message: 'Account type changed successfully.', new_account: newAccount });
    } catch (error) {
        await transaction.rollback();
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Error: Account tier already exists. Please try again with a different tier.' });
        }
        res.status(500).json({ message: 'Error changing account type: ' + error.message });
    }
};

const updateBankAccount = async (req, res) => {
    const { account_id } = req.params;
    const { user_id, balance } = req.body;

    const transaction = await sequelize.transaction();

    try {
        const bankAccount = await BankAccount.findByPk(account_id, {
            include: [{
                model: AccountTier,
                as: 'tier',
                attributes: ['tier_name'],
            }],
            transaction
        });

        if (!bankAccount) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Bank account not found.' });
        }

        let shouldUpdateUser = false;
        const replacements = {
            account_id: account_id
        };

        if (user_id) {
            const user = await User.findByPk(user_id, { transaction });
            if (!user) {
                await transaction.rollback();
                return res.status(404).json({ message: 'User not found.' });
            }
            if (bankAccount.user_id !== user_id) {
                bankAccount.account_name = `${user.username}.${bankAccount.tier.tier_name}@${process.env.EMAIL_PREFIX}.com`;
                bankAccount.user_id = user_id;
                shouldUpdateUser = true;
                replacements.user_id = user_id;
                replacements.account_name = bankAccount.account_name;
            }
        }
        if (balance !== undefined) {
            const parsedBalance = parseFloat(balance);
            if (isNaN(parsedBalance)) {
                await transaction.rollback();
                return res.status(400).json({ message: 'Invalid balance format. Please enter a valid number.' });
            }
            if (parsedBalance < 0) {
                await transaction.rollback();
                return res.status(400).json({ message: 'Balance cannot be less than 0.' });
            }
            bankAccount.balance = parsedBalance;
            replacements.balance = bankAccount.balance;
        }

        const updates = [];
        if (balance !== undefined) updates.push('balance = :balance');
        if (shouldUpdateUser) {
            updates.push('user_id = :user_id');
            updates.push('account_name = :account_name');
        }

        await sequelize.query(
            `UPDATE bank_accounts SET ${updates.join(', ')} WHERE id = :account_id`,
            {
                replacements,
                type: sequelize.QueryTypes.UPDATE,
                transaction
            }
        );

        await transaction.commit();

        res.status(200).json({ message: 'Bank account updated successfully.', account: bankAccount });
    } catch (error) {
        await transaction.rollback();
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Error: Account number already exists. Please try a different account number.' });
        }
        res.status(500).json({ message: 'Error updating bank account: ' + error.message });
    }
};

export {
    getLinkedAccounts,
    getUserAccounts,
    getAllBankAccounts,
    updateAccountBalance,
    createBankAccount,
    changeAccountType,
    updateBankAccount
};
