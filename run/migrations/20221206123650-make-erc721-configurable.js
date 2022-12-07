'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
        await queryInterface.addColumn('workspaces', 'erc721LoadingEnabled', {
          type: Sequelize.DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        }, { transaction });

        await queryInterface.sequelize.query(`
            UPDATE workspaces
            SET "erc721LoadingEnabled" = false
            WHERE public = true
        `, { transaction });
        
        await transaction.commit();
    } catch(error) {
      console.log(error)
      await transaction.rollback();
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('workspaces', 'erc721LoadingEnabled');
  }
};
