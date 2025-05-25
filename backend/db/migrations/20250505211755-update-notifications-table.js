'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add the shopId column to the Notifications table
    await queryInterface.addColumn('Notifications', 'shopId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // Optionally, you can add a foreign key constraint if needed
    await queryInterface.addConstraint('Notifications', {
      fields: ['shopId'],
      type: 'foreign key',
      name: 'fk_notifications_shopId', // Constraint name
      references: {
        table: 'Users', // Referenced table
        field: 'id', // Referenced column
      },
      onDelete: 'SET NULL', // Action on delete
      onUpdate: 'CASCADE', // Action on update
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the foreign key constraint
    await queryInterface.removeConstraint('Notifications', 'fk_notifications_shopId');

    // Remove the shopId column from the Notifications table
    await queryInterface.removeColumn('Notifications', 'shopId');
  }
};
