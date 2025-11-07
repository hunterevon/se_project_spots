// =======================
// 1. IMPORTS & STYLES
// =======================
import Api from "../utils/Api.js";
import { submitButtonText } from "../utils/helpers.js";
import "./index.css";
import {
  settings,
  enableValidation,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";

// =======================
// 2. API INITIALIZATION
// =======================
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "f1d92113-8da9-4685-b841-8f1b881d6ac0",
    "Content-Type": "application/json",
  },
});

// =======================
// 3. DOM ELEMENTS
// =======================

// Profile
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileSubmitBtn =
  editProfileModal.querySelector(".modal__submit-btn");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

// Avatar
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const editAvatarBtn = document.querySelector(".profile__avatar-btn");
const editAvatarForm = editAvatarModal.querySelector(".modal__form");
const editAvatarCloseBtn = editAvatarModal.querySelector(".modal__close-btn");
const editAvatarSubmitBtn = editAvatarModal.querySelector(".modal__submit-btn");
const editAvatarInput = editAvatarModal.querySelector("#profile-avatar-input");

// New Post
const newPostBtn = document.querySelector(".profile__post-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostForm = newPostModal.querySelector(".modal__form");
const newPostSubmitBtn = newPostModal.querySelector(".modal__submit-btn_error");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newCardImageInput = newPostModal.querySelector("#card-image-input");
const newCardCaptionInput = newPostModal.querySelector("#card-caption-input");

// Cards
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

// Delete Modal
const deleteModal = document.querySelector("#delete-modal");
const deleteModalCloseBtn = deleteModal.querySelector(
  ".modal__close-btn_delete"
);
const deleteModalCancelBtn = deleteModal.querySelector(".modal__cancel-btn");
const deleteModalDeleteBtn = deleteModal.querySelector(
  ".modal__submit-btn_delete"
);
const deleteForm = deleteModal.querySelector(".modal__form_delete");

// Preview Modal
const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");

// Overlay Modals
const overlayModals = [
  editProfileModal,
  newPostModal,
  previewModal,
  editAvatarModal,
  deleteModal,
];

// =======================
// 4. APP INITIALIZATION
// =======================
api
  .getAppInfo()
  .then(([cards, users]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
    profileNameEl.textContent = users.name;
    profileDescriptionEl.textContent = users.about;
    profileAvatar.src = users.avatar;
  })
  .catch(console.error);

// =======================
// 5. MODAL UTILITIES
// =======================
function handleEscapeKey(event) {
  if (event.key === "Escape") {
    const openModal = document.querySelector(".modal_is-opened");
    if (openModal) closeModal(openModal);
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscapeKey);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscapeKey);
}

function closeOnOverlay(evt) {
  if (evt.target.classList.contains("modal")) closeModal(evt.target);
}

// Apply overlay close for all modals
overlayModals.forEach((modal) =>
  modal.addEventListener("click", closeOnOverlay)
);

previewModalCloseBtn.addEventListener("click", () => closeModal(previewModal));

// =======================
// 6. PROFILE FUNCTIONS
// =======================
editProfileBtn.addEventListener("click", () => {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(editProfileForm, settings, [
    editProfileNameInput,
    editProfileDescriptionInput,
  ]);
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", () =>
  closeModal(editProfileModal)
);

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  submitButtonText(submitBtn, true);

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      disableButton(editProfileSubmitBtn, settings);
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      submitButtonText(submitBtn, false);
    });
}

// =======================
// 7. NEW POST FUNCTIONS
// =======================
newPostBtn.addEventListener("click", () => openModal(newPostModal));
newPostCloseBtn.addEventListener("click", () => closeModal(newPostModal));
newPostForm.addEventListener("submit", handleNewPostSubmit);

function handleNewPostSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitButtonText(submitBtn, true);

  api
    .addPost({
      name: newCardCaptionInput.value,
      link: newCardImageInput.value,
    })
    .then((data) => {
      const newCardElement = getCardElement(data);
      cardsList.prepend(newCardElement);
      newPostForm.reset();
      disableButton(newPostSubmitBtn, settings);
      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => {
      submitButtonText(submitBtn, false);
    });
}

// =======================
// 8. AVATAR FUNCTIONS
// =======================
editAvatarBtn.addEventListener("click", () => openModal(editAvatarModal));
editAvatarCloseBtn.addEventListener("click", () => closeModal(editAvatarModal));
editAvatarForm.addEventListener("submit", handleAvatarSubmit);

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitButtonText(submitBtn, true);
  api
    .editAvatarInfo({ avatar: editAvatarInput.value })
    .then((data) => {
      profileAvatar.src = data.avatar;
      editAvatarForm.reset();
      disableButton(editAvatarSubmitBtn, settings);
      closeModal(editAvatarModal);
    })
    .catch(console.error)
    .finally(() => {
      submitButtonText(submitBtn, false);
    });
}

// =======================
// 9. CARD CREATION & INTERACTIONS
// =======================
let selectedCard, selectedCardId;

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardTitleEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  // Like toggle
  cardLikeBtn.isLiked = data.isLiked;
  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_active");
  }

  function handleLike(evt, id) {
    const isLiked = evt.target.classList.contains("card__like-btn_active");
    api
      .handleLike(id, isLiked)
      .then((data) => {
        if (data.isLiked) {
          evt.target.classList.add("card__like-btn_active");
        } else {
          evt.target.classList.remove("card__like-btn_active");
        }
      })
      .catch(console.error);
  }
  cardLikeBtn.addEventListener("click", (evt) => handleLike(evt, data._id));

  // Delete Modal Popup
  function handleDeleteCard(cardElement, cardId) {
    selectedCard = cardElement;
    selectedCardId = cardId;
    openModal(deleteModal);
  }
  cardDeleteBtn.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

  // Preview image
  cardImageEl.addEventListener("click", () => {
    previewModalCaption.textContent = data.name;
    previewModalImage.src = data.link;
    previewModalImage.alt = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

// =======================
// 10. DELETE MODAL
// =======================
deleteModalCloseBtn.addEventListener("click", () => closeModal(deleteModal));
deleteModalCancelBtn.addEventListener("click", () => closeModal(deleteModal));
deleteModalDeleteBtn.addEventListener("click", () => closeModal(deleteModal));

// Delete card
function handleDeleteSubmit(evt) {
  const deleteBtn = evt.submitter;
  submitButtonText(deleteBtn, true, "Delete", "Deleting...");
  evt.preventDefault();
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      submitButtonText(deleteBtn, false, "Delete", "Deleting...");
    });
}
deleteForm.addEventListener("submit", handleDeleteSubmit);

// =======================
// 11. VALIDATION ENABLE
// =======================
enableValidation(settings);
