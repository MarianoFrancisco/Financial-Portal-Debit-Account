/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import BankAccount from '../models/bank-account-model.js';

const generateUniqueAccountNumber = async () => {
    let accountNumber;
    let exists = true;

    while (exists) {
        accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);

        const existingAccount = await BankAccount.findOne({ where: { account_number: accountNumber } });
        exists = !!existingAccount;
    }

    return accountNumber;
};

export default generateUniqueAccountNumber;