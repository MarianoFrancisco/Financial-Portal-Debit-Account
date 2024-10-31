/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import AccountClosure from '../models/account-closure-model.js';
import AccountTier from '../models/account-tier-model.js';
import BankAccount from '../models/bank-account-model.js';
import Transaction from '../models/transaction-model.js';
import User from '../models/user-model.js';
import sequelize from '../../config/database-connection.js';
import { Op } from 'sequelize';

const getAccountTransactions = async (req, res) => {
    const { account_id } = req.params;
    const { date } = req.query;

    try {
        const [totals] = await sequelize.query(
            `SELECT 
                SUM(CASE WHEN transaction_type = 'Income' THEN amount ELSE 0 END) AS total_ingresos,
                SUM(CASE WHEN transaction_type = 'Expense' THEN amount ELSE 0 END) AS total_egresos,
                COUNT(CASE WHEN transaction_type = 'Income' THEN 1 END) AS count_ingresos,
                COUNT(CASE WHEN transaction_type = 'Expense' THEN 1 END) AS count_egresos
            FROM transactions
            WHERE bank_account_id = :account_id 
              AND transaction_date <= :date`,
            { replacements: { account_id, date }, type: sequelize.QueryTypes.SELECT }
        );

        res.status(200).json(totals);
    } catch (error) {
        res.status(500).json({ message: 'Error generating report: ' + error.message });
    }
};

const getAllAccountTransactions = async (req, res) => {
    const { date } = req.query;

    try {
        const transactions = await Transaction.findAll({
            attributes: ['id', 'bank_account_id', 'transaction_type', 'amount', ['transaction_date', 'date']],
            where: {
                transaction_date: {
                    [Op.lte]: date,
                }
            },
            order: [['transaction_date', 'ASC']]
        });

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error generating report: ' + error.message });
    }
};

const getFrozenAccounts = async (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ message: 'Date parameter is required' });
    }

    try {
        const frozenAccounts = await BankAccount.findAll({
            attributes: ['id', 'account_number', 'creation_date', 'balance'],
            where: {
                id: {
                    [Op.notIn]: sequelize.literal('(SELECT DISTINCT bank_account_id FROM transactions)')
                },
                creation_date: {
                    [Op.lte]: date,
                },
            },
        });

        res.status(200).json(frozenAccounts);
    } catch (error) {
        res.status(500).json({ message: 'Error generating report: ' + error.message });
    }
}

const getAccountDetail = async (req, res) => {
    const { account_number } = req.params;

    try {
        const account = await BankAccount.findOne({
            where: { account_number },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: []
                },
                {
                    model: AccountTier,
                    as: 'tier',
                    attributes: []
                }
            ],
            attributes: {
                include: [
                    [sequelize.col('user.username'), 'username'],
                    [sequelize.col('tier.tier_name'), 'tier_name']
                ]
            }
        });

        if (!account) {
            return res.status(404).json({ message: 'Account not found.' });
        }

        res.status(200).json(account);
    } catch (error) {
        res.status(500).json({ message: 'Error generating report: ' + error.message });
    }
};

const getAccountStatusSummary = async (req, res) => {
    try {
        const summary = await BankAccount.findAll({
            attributes: ['close', [sequelize.fn('COUNT', sequelize.col('*')), 'total_accounts']],
            group: ['close'],
        });

        res.status(200).json(summary);
    } catch (error) {
        res.status(500).json({ message: 'Error generating report: ' + error.message });
    }
};

const getAccountClosures = async (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ message: 'Date parameter is required' });
    }

    try {
        const closures = await AccountClosure.findAll({
            attributes: ['bank_account_id', 'closure_reason', 'closure_date'],
            where: {
                closure_date: {
                    [Op.lte]: date,
                },
            },
            include: [{
                model: BankAccount,
                as: 'bankAccount',
                attributes: ['account_number', 'balance'],
            }],
            order: [['closure_date', 'ASC']],
        });

        res.status(200).json(closures);
    } catch (error) {
        res.status(500).json({ message: 'Error generating report: ' + error.message });
    }
};

export {
    getAccountTransactions,
    getAllAccountTransactions,
    getFrozenAccounts,
    getAccountDetail,
    getAccountStatusSummary,
    getAccountClosures
};
