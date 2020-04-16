
import Sequelize from 'sequelize';

// database connection configuration
var sequelize = new Sequelize('synergy', 'postgres', 'password', {
  dialect: 'postgres',
  operatorAliases: Sequelize.Op,
  define: {
    underscored: true
  },
});

const models = {
  User: sequelize['import']('./user'),
  Channel: sequelize['import']('./channel'),
  Message: sequelize['import']('./message'),
  Team: sequelize['import']('./team'),
  Member: sequelize['import']('./member'),
  DirectMessage: sequelize['import']('./directMessage.js'),
};


Object.keys(models).forEach(modelName => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;