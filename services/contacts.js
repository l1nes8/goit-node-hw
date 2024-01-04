const Contact = require("../models/contactsModel");
const HttpError = require("../utils/HttpErrors");

const listContacts = async () => {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId);

    if (!contact) {
      throw new HttpError(404, `Contact with ID ${contactId} not found`);
    }

    return contact;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

const addContact = async (body) => {
  try {
    const requiredFields = ["name", "email", "phone"];
    for (const field of requiredFields) {
      if (!body[field]) {
        throw new HttpError(400, `Отсутствует обязательное поле: ${field}`);
      }
    }

    const newContact = await Contact.create({
      name: body.name,
      email: body.email,
      phone: body.phone,
    });

    return newContact;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const removeContact = async (contactId) => {
  try {
    const result = await Contact.findByIdAndDelete(contactId);

    if (result) {
      return { message: "Contact deleted" };
    } else {
      throw new HttpError(404, "Not found");
    }
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

const updateContact = async (contactId, body) => {
  try {
    if (!body || Object.keys(body).length === 0) {
      throw new HttpError(400, "Missing fields");
    }
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { $set: body },
      { new: true }
    );

    if (updatedContact === -1) {
      throw new HttpError(404, "Not found");
    }

    return updatedContact;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

const updateStatusContact = async (contactId, body) => {
  try {
    if (!body || Object.keys(body).length === 0) {
      throw new HttpError(400, "Missing fields");
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { $set: { favorite: body.favorite } },
      { new: true }
    );

    if (!updatedContact) {
      throw new HttpError(404, "Not found");
    }

    return updatedContact;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};
