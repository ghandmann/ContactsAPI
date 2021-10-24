// Shorthand document.ready function from JQuery
// https://learn.jquery.com/using-jquery-core/document-ready/
$(async () => {
    console.log("ContactsAPI client.js document.ready event!")
    registerModalButtons();
    const contacts = await loadContacts();
    renderContacts(contacts);
});

async function loadContacts() {
    const res = await fetch("/api/v1/contacts");
    const contactList = await res.json();

    return contactList;
}

function registerModalButtons() {
    $("button.add-contact").on("click", () => bootstrap.Modal.getOrCreateInstance("#addContactModal").show());
    $("#addContactModal button.save-changes").on("click", addContact);

    const registerAddPhonenumberButton = () => {
        const addPhonenumberModal = $("#addPhonenumberModal");
        const saveChangesButton = $(".save-changes.btn", addPhonenumberModal);

        saveChangesButton.on("click", async () => {
            const newPhonenumberInput = $("input#newPhonenumber", addPhonenumberModal);
            const categoryInput = $("input#phonenumberCategory", addPhonenumberModal);
            const contactIdInput = $(`input[name="contactId"]`, addPhonenumberModal);

            await addPhonenumberToContact(contactIdInput.val(), newPhonenumberInput.val(), categoryInput.val());

            // reset input fields
            newPhonenumberInput.val("");
            categoryInput.val("");
            contactIdInput.val("");

            bootstrap.Modal.getOrCreateInstance("#addPhonenumberModal").hide();
        });
    };

    const registerAddEmailaddressButton = () => {
        const addEmailaddressModal = $("#addEmailaddressModal");
        const saveChangesButton = $(".save-changes.btn", addEmailaddressModal);

        saveChangesButton.on("click", async () => {
            const newEmailaddressInput = $("input#newEmailaddress", addEmailaddressModal);
            const categoryInput = $("input#emailaddressCategory", addEmailaddressModal);
            const contactIdInput = $(`input[name="contactId"]`, addEmailaddressModal);

            await addEmailaddressToContact(contactIdInput.val(), newEmailaddressInput.val(), categoryInput.val());

            // reset input fields
            newEmailaddressInput.val("");
            categoryInput.val("");
            contactIdInput.val("");

            bootstrap.Modal.getOrCreateInstance("#addEmailaddressModal").hide();
        });
    };

    registerAddPhonenumberButton();
    registerAddEmailaddressButton();
}

async function addContact() {
    const modal = $("#addContactModal");

    const firstname = $("input#firstname").val();
    const lastname = $("input#lastname").val();
    const nickname = $("input#nickname").val();
    const birthdate = $("input#birthdate").val();

    const payload = {
        firstname, lastname, nickname, birthdate
    };

    await sendPostRequest("/api/v1/contacts/", payload);

    await reloadContactList();

    bootstrap.Modal.getOrCreateInstance("#addContactModal").hide();
}

async function reloadContactList() {
    const contacts = await loadContacts();
    renderContacts(contacts);
}

function renderContacts(contactList) {
    const contactsContainer = $("#contacts");
    contactsContainer.empty();

    if(contactList.length === 0) {
        const noContactsInfo = $(`
            <div class="alert alert-info" role="alert">
            <h4 class="alert-heading">Zero contacts!</h4>
            <p>There are no contacts to show. Why don't you just start by <a href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#addContactModal">adding</a> a new contact?</p>
            </div>
      `);

      contactsContainer.append(noContactsInfo);
      return;
    }

    const contactsAccordion = $(`<div class="accordion"></div>`);

    contactList.forEach((contact) => {
        const contactListItem = renderContactListItem(contact);
        contactsAccordion.append(contactListItem);
    });

    contactsContainer.append(contactsAccordion);
}

function renderContactListItem(contact) {
    const elementId = `contact-${contact.id}`;
    const contactItem = $(`
    <div class="accordion-item" data-id="${contact.id}">
        <h2 class="accordion-header" id="headingOne">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${elementId}" aria-expanded="true" aria-controls="${elementId}">
            ${contact.lastname}, ${contact.firstname} (${contact.nickname})
        </button>
        </h2>
        <div id="${elementId}" class="accordion-collapse collapse" aria-labelledby="headingOne">
            <div class="accordion-body">
            </div>
        </div>
    </div>
    `);

    const contactItemBody = $(".collapse", contactItem);
    contactItemBody.on("show.bs.collapse", async (event) => { 
        const contactAccordionItem = $(event.currentTarget).parent("div.accordion-item");
        const contactId = contactAccordionItem.attr("data-id");

        const details = await loadContactDetails(contactId);
        const detailsBody = renderContactDetails(contactId, contact, details);

        const accordionBody = $(".accordion-body", contactAccordionItem);
        accordionBody.empty();

        accordionBody.append(detailsBody);


    });

    return contactItem;
}

async function loadContactDetails(contactId) {
    const phonenumbers = await fetchPhonenumbers(contactId);
    const emailaddresses = await fetchEmailaddresses(contactId);

    return {
        phonenumbers,
        emailaddresses
    };
}

async function fetchPhonenumbers(contactId) {
    const response = await fetch("/api/v1/phonenumbers/" + contactId);
    return response.json();
}

async function fetchEmailaddresses(contactId) {
    const response = await fetch("/api/v1/emailaddresses/" + contactId);
    return response.json();
}

function renderContactDetails(contactId, contact, contactDetails) {
    const body = $(`
    <div class="accordion-body">
        <div>
            <h4>Birthdate</h4>
            ${contact.birthdate}
        </div>
        <div class="phonenumbers">
            <h4>Phonenumbers <span class="add-phonenumber-button btn badge bg-success"><i class="bi-plus-circle"></i></span></h4>
            <ul class="list-group"></ul>
        </div>
        <div class="emailaddresses">
            <h4>Emailaddresses <span class="add-emailaddress-button btn badge bg-success"><i class="bi-plus-circle"></i></span></h4>
            <ul class="list-group"></ul>
        </div><br/>
        <button class="delete-contact btn btn-danger"><i class="bi bi-person-x"></i> Delete Contact</button>
    </div>
    `);

    registerClickEventForAddPhonenumberButton(body, contactId);
    registerClickEventForAddEmailaddressButton(body, contactId);
    registerClickEventForDeleteContactButton(body, contactId);

    const phonenumbersContainer = $("div.phonenumbers ul", body);
    phonenumbersContainer.append(renderPhonenumberListing(contactId, contactDetails.phonenumbers));

    const emailaddressesContainer = $("div.emailaddresses ul", body);
    emailaddressesContainer.append(renderEmailaddressListing(contactId, contactDetails.emailaddresses));

    return body;
}

function registerClickEventForAddPhonenumberButton(body, contactId) {
    const addPhonenumberButton = $(".add-phonenumber-button", body);
    addPhonenumberButton.on("click", () => {
        const modal = $("#addPhonenumberModal");
        const contactIdInput = $(`input[name="contactId"]`, modal);
        contactIdInput.val(contactId);
        
        bootstrap.Modal.getOrCreateInstance("#addPhonenumberModal").show();
    });
}

function registerClickEventForAddEmailaddressButton(body, contactId) {
    const addEmailaddressButton = $(".add-emailaddress-button", body);
    addEmailaddressButton.on("click", () => { 
        const modal = $("#addEmailaddressModal");
        const contactIdInput = $(`input[name="contactId"]`, modal);
        contactIdInput.val(contactId);

        bootstrap.Modal.getOrCreateInstance("#addEmailaddressModal").show();
    });
}

function registerClickEventForDeleteContactButton(body, contactId) {
    $("button.delete-contact", body).on("click", async () => {
        const payload = { contactId };
        sendDeleteRequest("/api/v1/contacts/", payload);

        await reloadContactList();
    });

}

function renderPhonenumberListing(contactId, phonenumbers) {
    if(phonenumbers.length === 0) {
        return $(`<li class="list-group-item">This contact has no phonenumbers</li>`);
    }

    const phonenumberDeleteAction = async (clickEvent) => {
        const clickedElement = $(clickEvent.currentTarget);
        const contactId = clickedElement.parents(".accordion-item").attr("data-id");
        const phonenumberId = clickedElement.parents(".list-group-item").attr("data-id");

        await deletePhonenumberFromContact(contactId, phonenumberId);
    }

    return phonenumbers.map(
        (phonenumber) => renderListItem(contactId, phonenumber.id, phonenumber.phonenumber, phonenumber.category, phonenumberDeleteAction)
    );
}


function renderEmailaddressListing(contactId, emailaddresses) {
    if(emailaddresses.length === 0) {
        return $(`<li class="list-group-item">This contact has no emailaddresses</li>`);
    }

    const emailaddressDeleteAction = async (clickEvent) => {
        const clickedElement = $(clickEvent.currentTarget);
        const contactId = clickedElement.parents(".accordion-item").attr("data-id");
        const emailaddressId = clickedElement.parents(".list-group-item").attr("data-id");

        await deleteEmailaddressFromContact(contactId, emailaddressId);
    }
    
    return emailaddresses.map(
        (emailaddress) => renderListItem(contactId, emailaddress.id, emailaddress.emailaddress, emailaddress.category, emailaddressDeleteAction)
        );
    }

function renderListItem(contactId, itemId, itemText, itemCategory, deleteAction) {
    const item = $(`<li class="list-group-item" data-id="${itemId}" data-contact-id="${contactId}">${itemText} <span class="badge bg-secondary">${itemCategory}</span></li>`);

    const deleteButton = $(`<span class="btn badge bg-danger"><i class="bi-trash"></i></span>`);
    deleteButton.on("click", deleteAction);
    item.append(deleteButton);

    return item;
}

async function addPhonenumberToContact(contactId, phonenumber, category) {
    const payload = { phonenumber , category };

    try {
        await sendPostRequest(`/api/v1/phonenumbers/${contactId}/`, payload);
        
        await reloadPhonenumbersForContact(contactId);
    }
    catch(error) {
        showError(`Failed to add phonenumber=${phonenumber} for contactId=${contactId} with error: ${error.message}`);
    }
}

async function deletePhonenumberFromContact(contactId, phonenumberId) {
    const payload = { id: phonenumberId };
    try {
        
        await sendDeleteRequest(`/api/v1/phonenumbers/${contactId}/`, payload);

        await reloadPhonenumbersForContact(contactId);
    }
    catch(error) {
        showError(`Failed to delete phonenumber with id=${phonenumberId} for contactId=${contactId} with error=${error.message}`);
    }
}

async function sendPostRequest(path, payload) {
    sendRequestWithPayload(path, "POST", payload);
}

async function sendDeleteRequest(path, payload) {
    sendRequestWithPayload(path, "DELETE", payload);
}

async function sendRequestWithPayload(path, method, payload) {
    const res = await fetch(path, {
        method,
        body: JSON.stringify(payload),
        headers: {
            "content-type": "application/json",
        },
    });

    if(res.status !== 200) {
        throw new Error("Request failed!");
    }
}

function showError(errorMessage) {
    console.log(errorMessage);
}

async function reloadPhonenumbersForContact(contactId) {
    const phonenumbers = await fetchPhonenumbers(contactId);

    const phonenumbersListing = renderPhonenumberListing(contactId, phonenumbers);

    const phonenumbersListContainer = $(`div#contact-${contactId} div.phonenumbers ul.list-group`);
    phonenumbersListContainer.empty();
    phonenumbersListContainer.append(phonenumbersListing);
}

async function addEmailaddressToContact(contactId, emailaddress, category) {
    const payload = { emailaddress, category };

    try {
        await sendPostRequest(`/api/v1/emailaddresses/${contactId}`, payload);

        await reloadEmailaddressesForContact(contactId);
    }
    catch(error) {
        showError(`Failed to add emailaddress=${emailaddress} for contactId=${contactId} with error: ${error.message}`);
    }
}

async function deleteEmailaddressFromContact(contactId, emailaddressId) {
    const payload = { id: emailaddressId };
    try {
        await sendDeleteRequest(`/api/v1/emailaddresses/${contactId}/`, payload);

        await reloadEmailaddressesForContact(contactId);
    }
    catch(error) {
        showError(`Failed to delete emailaddress with id=${emailaddressId} for contactId=${contactId} with error: ${error.message}`);
    }
}


async function reloadEmailaddressesForContact(contactId) {
    const emailaddresses = await fetchEmailaddresses(contactId);

    const emailaddressesListing = renderEmailaddressListing(contactId, emailaddresses);

    const emailaddressesListContainer = $(`div#contact-${contactId} div.emailaddresses ul.list-group`);
    emailaddressesListContainer.empty();
    emailaddressesListContainer.append(emailaddressesListing);
}
