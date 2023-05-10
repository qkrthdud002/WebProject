const Sequuelize = require('sequelize');

class Domain extends Sequuelize.Model {
    static initiate(sequelize) {
        Domain.init({
            host: {
                type:Sequuelize.STRING(80),
                allowNull: false,
            },
            type: {
                type: Sequuelize.ENUM('free', 'premium'),
                allowNull: false,
            },
            clientSecret: {
                type: Sequuelize.UUID,
                allowNull: false,
            },
            },{
                sequelize,
                timestamps: true,
                paranoid: true,
                modelName: 'Domain',
                tableName: 'domains',
            
        });
    }

    static associate(db) {
        db.Domain.belongsTo(db.User);
    }
};

module.exports = Domain;

