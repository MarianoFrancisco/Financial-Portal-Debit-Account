/*
* @author
* Mariano Camposeco {@literal (mariano1941@outlook.es)}
*/
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql',
  port: process.env.MYSQL_PORT,
  logging: false
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection successfully established with the database.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
})();

export default sequelize;