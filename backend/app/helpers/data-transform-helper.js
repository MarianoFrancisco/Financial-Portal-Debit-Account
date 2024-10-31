/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/

export const transformAccountData = (linkedAccounts) => {
    return linkedAccounts.map(link => ({
        account: {
            account_name: link.account.account_name,
            account_number: link.account.account_number,
            balance: link.account.balance,
            creation_date: link.account.creation_date,
            currency: link.account.currency.name,
            tier: link.account.tier.tier_name 
        }
    }));
};