'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Change 'category' column in 'users' table to ENUM type
    await queryInterface.changeColumn('Users', 'category', {
      type: Sequelize.ENUM('Electronics', 'Clothes', 'Furniture', 'Food'),
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.changeColumn('Users', 'category', {
      type: Sequelize.STRING, // Revert to STRING or previous type
      allowNull: false,
    });
  }
};
