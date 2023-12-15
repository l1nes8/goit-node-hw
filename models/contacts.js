const Contact = require("./contactsModel");

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
      const error = new Error(`Contact with ID ${contactId} not found`);
      error.status = 404;
      throw error;
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
        const error = new Error(`Отсутствует обязательное поле: ${field}`);
        error.status = 400;
        throw error;
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
      const error = new Error("Not found");
      error.status = 404;
      throw error;
    }
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

const updateContact = async (contactId, body) => {
  try {
    if (!body || Object.keys(body).length === 0) {
      const error = new Error("Missing fields");
      error.status = 400;
      throw error;
    }
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { $set: body },
      { new: true }
    );

    if (updatedContact === -1) {
      const error = new Error("Not found");
      error.status = 404;
      throw error;
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
};
