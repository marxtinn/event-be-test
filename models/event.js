"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class events extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      events.belongsTo(models.users, { foreignKey: "company_user_id" });
      events.belongsTo(models.users, { foreignKey: "vendor_user_id" });
    }
  }
  events.init(
    {
      uuid: DataTypes.STRING,
      event_name: DataTypes.STRING,
      event_type: DataTypes.ENUM(
        "Health Talk",
        "Onsite Screenings",
        "Fitness Classes",
        "Workshops",
        "Webinars"
      ),
      status: DataTypes.ENUM("Pending", "Approved", "Rejected"),
      proposed_date_1: DataTypes.DATEONLY,
      proposed_date_2: DataTypes.DATEONLY,
      proposed_date_3: DataTypes.DATEONLY,
      proposed_location: DataTypes.STRING,
      remarks: DataTypes.STRING,
      confirmed_date: DataTypes.DATEONLY,
      company_user_id: DataTypes.INTEGER,
      vendor_user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "events",
    }
  );
  return events;
};
