/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import Transaction from '../models/transaction-model.js';

const registerTransaction = async (bankAccountId, transactionType, amount, transaction) => {
    try {
        await Transaction.create({
            bank_account_id: bankAccountId,
            transaction_type: transactionType,
            amount: amount
        }, { transaction });
    } catch (error) {
        throw new Error('Error registering transaction: ' + error.message);
    }
};

export {
    registerTransaction
};
