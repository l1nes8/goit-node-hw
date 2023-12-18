const express = require("express");
const router = express.Router();
const {
  getContacts,
  getContact,
  creatContacts,
  deleteContacts,
  updateContacts,
  updateStatusContacts,
} = require("../../controller.js/contactsControllers.js");

router.get("/", getContacts);

router.get("/:contactId", getContact);

router.post("/", creatContacts);

router.delete("/:contactId", deleteContacts);

router.put("/:contactId", updateContacts);

router.patch("/:contactId/favorite", updateStatusContacts);

module.exports = router;
