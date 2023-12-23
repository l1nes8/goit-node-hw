const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../services/contacts.js");

const {
  createContactSchema,
  updateContactSchema,
  updateStatusSchema,
} = require("../validate/validateSchem.js");

exports.getContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

exports.getContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

exports.creatContacts = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      const validationError = new Error(error.details[0].message);
      validationError.status = 400;
      throw validationError;
    }

    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

exports.deleteContacts = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await removeContact(contactId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.updateContacts = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { body } = req;

    const { error } = updateContactSchema.validate(body);
    if (error) {
      const validationError = new Error(error.details[0].message);
      validationError.status = 400;
      throw validationError;
    }

    const updatedContact = await updateContact(contactId, body);

    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};

exports.updateStatusContacts = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { body } = req;
    const { error } = updateStatusSchema.validate(body);
    if (error) {
      const validationError = new Error(error.details[0].message);
      validationError.status = 400;
      throw validationError;
    }

    const updatedContact = await updateStatusContact(contactId, body);

    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};
