/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import AccountClosure from '../models/account-closure-model.js';
import sequelize from '../../config/database-connection.js';

const closeBankAccount = async (req, res) => {
    const { id } = req.params;
    const { closure_reason } = req.body;

    const transaction = await sequelize.transaction();

    try {
        const [results] = await sequelize.query(
            'UPDATE bank_accounts SET close = 1 WHERE id = :id',
            { replacements: { id }, transaction }
        );

        if (results.affectedRows === 0) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Bank account not found or already closed.' });
        }

        await AccountClosure.create(
            {
                bank_account_id: id,
                closure_reason
            },
            { transaction }
        );

        await transaction.commit();
        res.status(200).json({ message: 'Bank account closed successfully.' });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: `Error closing bank account: ${error.message}` });
    }
};

const activateBankAccount = async (req, res) => {
    const { id } = req.params;

    const transaction = await sequelize.transaction();

    try {
        const [results] = await sequelize.query(
            'UPDATE bank_accounts SET close = 0 WHERE id = :id',
            { replacements: { id }, transaction }
        );

        if (results.affectedRows === 0) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Bank account not found or already active.' });
        }

        await sequelize.query(
            'DELETE FROM account_closures WHERE bank_account_id = :id',
            { replacements: { id }, transaction }
        );

        await transaction.commit();
        res.status(200).json({ message: 'Bank account activated successfully.' });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: `Error activating bank account: ${error.message}` });
    }
};

export {
    closeBankAccount,
    activateBankAccount
};