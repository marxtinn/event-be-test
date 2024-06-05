const route = require("express").Router();

const {
  createEvent,
  approveEvent,
  rejectEvent,
  fetchCompanyEventData,
  fetchVendorEventData,
} = require("../controllers/eventController");
const { readToken } = require("../helpers/jwt");

// Set url/route for accessing controller through API hit.

route.post("/create-event", createEvent);
route.patch("/approve", approveEvent);
route.patch("/reject", rejectEvent);
route.post("/my-events", fetchCompanyEventData);
route.post("/my-event-requests", fetchVendorEventData)

module.exports = route;
