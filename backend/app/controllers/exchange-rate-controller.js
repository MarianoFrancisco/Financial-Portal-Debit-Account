/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import ExchangeRate from '../models/exchange-rate-model.js';
import Currency from '../models/currency-model.js';
import sequelize from '../../config/database-connection.js';

const getExchangeRates = async (req, res) => {
    try {
        const exchangeRates = await ExchangeRate.findAll({
            attributes: ['id', 'rate', 'last_update'],
            include: [
                {
                    model: Currency,
                    as: 'originCurrency',
                    attributes: ['id', 'name'],
                },
                {
                    model: Currency,
                    as: 'destinationCurrency',
                    attributes: ['id', 'name'],
                },
            ],
        });

        if (exchangeRates.length === 0) {
            return res.status(404).json({ message: 'No exchange rates found.' });
        }

        const exchange_rate = exchangeRates.map(rate => ({
            id: rate.id,
            originCurrencyId: rate.originCurrency.id,
            destinationCurrencyId: rate.destinationCurrency.id,
            originCurrencyName: rate.originCurrency.name,
            destinationCurrencyName: rate.destinationCurrency.name,
            rate: parseFloat(rate.rate),
            lastUpdate: rate.last_update
        }));

        res.status(200).json(exchange_rate);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving exchange rates: ' + error.message });
    }
};

const getExchangeRateForCurrency = async (originCurrencyId, destinationCurrencyId) => {
    try {
        const exchangeRate = await ExchangeRate.findOne({
            where: {
                origin_currency_id: originCurrencyId,
                destination_currency_id: destinationCurrencyId
            },
            attributes: ['rate']
        });

        if (!exchangeRate) {
            throw new Error('Exchange rate not found for the specified currency.');
        }

        return parseFloat(exchangeRate.rate);
    } catch (error) {
        throw new Error('Error retrieving exchange rate: ' + error.message);
    }
};

const getExchangeRate = async (originCurrencyId, destinationCurrencyId) => {
    const exchangeRate = await ExchangeRate.findOne({
        where: {
            origin_currency_id: originCurrencyId,
            destination_currency_id: destinationCurrencyId
        }
    });
    return exchangeRate ? parseFloat(exchangeRate.rate) : null;
};

const convertToGTQ = async (amount, currencyId) => {
    const gtqCurrencyId = 1;

    if (amount < 0) {
        if (currencyId !== gtqCurrencyId) {
            const rate = await getExchangeRate(currencyId, gtqCurrencyId);
            return rate ? amount / rate : amount;
        }
        return amount;
    }
    else {
        if (currencyId === gtqCurrencyId) {
            return amount;
        } else {
            const rate = await getExchangeRate(gtqCurrencyId, currencyId);
            return rate ? amount * rate : amount;
        }
    }
};

const updateExchangeRate = async (req, res) => {
    const { origin_currency_id, destination_currency_id, rate } = req.body;
    const transaction = await sequelize.transaction();

    try {
        const exchangeRate = await ExchangeRate.findOne({
            where: {
                origin_currency_id,
                destination_currency_id
            },
            transaction
        });

        if (!exchangeRate) {
            return res.status(404).json({ message: 'Exchange rate not found.' });
        }

        await exchangeRate.update({ rate }, { transaction });

        //const inverseRate = 1 / rate;

        //const inverseExchangeRate = await ExchangeRate.findOne({
        //    where: {
        //        origin_currency_id: destination_currency_id,
        //        destination_currency_id: origin_currency_id
        //    },
        //    transaction
        //});

        //if (!inverseExchangeRate) {
        //    return res.status(404).json({ message: 'Inverse exchange rate not found.' });
        //}

        //await inverseExchangeRate.update({ rate: inverseRate }, { transaction });

        await transaction.commit();
        res.status(200).json({ message: 'Exchange rate updated successfully.' });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Error updating exchange rate: ' + error.message });
    }
};

export {
    convertToGTQ,
    updateExchangeRate,
    getExchangeRates,
    getExchangeRateForCurrency
};