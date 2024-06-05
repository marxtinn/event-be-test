// Imports
const sequelize = require("sequelize");
const { join } = require("path");
const model = require("../../models");
const { v4: uuidv4 } = require("uuid");
const uuid = uuidv4();
const { createToken, readToken, extractToken } = require("../helpers/jwt");
const fs = require("fs");

module.exports = {
  createEvent: async (req, res, next) => {
    const ormTransaction = await model.sequelize.transaction();
    try {
      const {
        event_name,
        event_type,
        status,
        proposed_date_1,
        proposed_date_2,
        proposed_date_3,
        proposed_location,
        company_user_id,
        vendor_user_id,
      } = req.body;

      if (
        !event_name ||
        !event_type ||
        !status ||
        !proposed_date_1 ||
        !proposed_date_2 ||
        !proposed_date_3 ||
        !proposed_location ||
        !company_user_id ||
        !vendor_user_id
      ) {
        await ormTransaction.rollback();
        return res.status(400).send({
          success: true,
          message: "Failed to create event. Fill all the fields.",
        });
      } else {
        const createEvent = await model.events.create(
          {
            uuid: uuidv4(),
            event_name: event_name,
            event_type: event_type,
            status: "Pending",
            proposed_date_1: proposed_date_1,
            proposed_date_2: proposed_date_2,
            proposed_date_3: proposed_date_3,
            proposed_location: proposed_location,
            company_user_id: company_user_id,
            vendor_user_id: vendor_user_id,
          },
          {
            transaction: ormTransaction,
          }
        );
        await ormTransaction.commit();
        return res.status(200).send({
          success: true,
          message: "Event created",
          data: createEvent,
        });
      }
    } catch (error) {
      await ormTransaction.rollback();
      console.log(error);
      next(error);
    }
  },
  approveEvent: async (req, res, next) => {
    const ormTransaction = await model.sequelize.transaction();
    try {
      const { uuid, status, confirmed_date } = req.body;
      const fetchEventData = await model.events.findOne({
        where: { uuid: uuid },
      });

      const eventData = fetchEventData.dataValues;

      if (!eventData) {
        return res.status(400).send({
          success: false,
          message: "Access denied.",
        });
      }

      if (
        confirmed_date !== eventData.proposed_date_1 &&
        confirmed_date !== eventData.proposed_date_2 &&
        confirmed_date !== eventData.proposed_date_3
      ) {
        ormTransaction.rollback();
        return res.status(400).send({
          success: false,
          message:
            "Confirmed Date doesn't match proposed dates. Select the correct date!",
        });
      } else {
        const vendorApproval = await model.events.update(
          {
            status: status,
            confirmed_date: confirmed_date,
          },
          {
            where: { uuid: eventData.uuid },
          },
          { transaction: ormTransaction }
        );
        await ormTransaction.commit();
        return res.status(200).send({
          success: true,
          message: "Event approved.",
          data: vendorApproval,
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  rejectEvent: async (req, res, next) => {
    const ormTransaction = await model.sequelize.transaction();
    try {
      const { uuid, status, remarks } = req.body;
      const fetchEventData = await model.events.findOne({
        where: { uuid: uuid },
      });

      const eventData = fetchEventData.dataValues;

      if (!eventData) {
        return res.status(400).send({
          success: false,
          message: "Access denied.",
        });
      }

      if (!remarks) {
        ormTransaction.rollback();
        return res.status(400).send({
          success: false,
          message:
            "Please fill in the remarks field and explain why you reject the event.",
        });
      } else {
        const vendorApproval = await model.events.update(
          {
            status: status,
            remarks: remarks,
          },
          {
            where: { uuid: eventData.uuid },
          },
          { transaction: ormTransaction }
        );
        await ormTransaction.commit();
        return res.status(200).send({
          success: true,
          message: "Event approved.",
          data: vendorApproval,
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  fetchCompanyEventData: async (req, res, next) => {
    try {
      const { company_user_id } = req.body;
      const fetchEventDataByCompanyUserID = await model.events.findAll({
        where: { company_user_id: company_user_id },
        include: [
          {
            model: model.users,
            attributes: ["name"],
          },
        ],
      });

      const data = fetchEventDataByCompanyUserID;

      return res.status(200).send({
        success: true,
        message: "Fetched my events.",
        data: data,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  fetchVendorEventData: async (req, res, next) => {
    try {
      const { vendor_user_id } = req.body;
      const fetchEventDataByCompanyUserID = await model.events.findAll({
        where: { vendor_user_id: vendor_user_id },
        include: [
          {
            model: model.users,
            attributes: ["name"],
          },
        ],
      });

      const data = fetchEventDataByCompanyUserID;

      return res.status(200).send({
        success: true,
        message: "Fetched my events.",
        data: data,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
