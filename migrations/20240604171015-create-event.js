"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Events", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        type: Sequelize.STRING,
      },
      event_name: {
        type: Sequelize.STRING,
      },
      event_type: {
        type: Sequelize.ENUM(
          "Health Talk",
          "Onsite Screenings",
          "Fitness Classes",
          "Workshops",
          "Webinars"
        ),
      },
      status: {
        type: Sequelize.ENUM("Pending", "Approved", "Rejected"),
      },
      proposed_date_1: {
        type: Sequelize.DATE,
      },
      proposed_date_2: {
        type: Sequelize.DATE,
      },
      proposed_date_3: {
        type: Sequelize.DATE,
      },
      proposed_location: {
        type: Sequelize.STRING,
      },
      remarks: {
        type: Sequelize.STRING,
      },
      confirmed_date: {
        type: Sequelize.DATE,
      },
      company_user_id: {
        type: Sequelize.INTEGER,
      },
      vendor_user_id: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Events");
  },
};
