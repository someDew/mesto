// импорт модулей
import {Api} from './scripts/api.js';

// импорт стилей
import "./pages/index.css";

// работает с датой профиля
class UserInfo {
  constructor(api) {
    this.api = api;
  }
  // запрашивает данные юзера
  load() {
    this.api.getUserData().then((userData) => {
      this.api.userId = userData._id;
      // рендерит
      this.render(userData);
    });
  }
  // прошу записать юзер дату, ответ pендерю
  changeNameAbout(data) {
    this.api.patchUserData(data).then((userData) => {
      this.render(userData);
    })
  }
  // рендер, который рисует
  render(userData) {
    document.querySelector('.user-info__name').textContent = userData.name;
    document.querySelector('.user-info__job').textContent = userData.about;
    document.querySelector('.user-info__photo').style.backgroundImage = `url(${userData.avatar})`;
  }
  // меняю юзер-пик
  changeUserPic(data) {
    this.api.patchUserPic(data).then((userData) => {
      console.log(userData);
      this.render(userData);
    })
  }
}

// работающая со списком карточек
class CardList {
  constructor(container, api) {
    this.api = api;
    this.container = container;
    this.cardsData = [];
  }
  // прошу карточки, читаю, рисую
  render() {
    this.api.getCardList().then((cardsList) => {
      for (let cardData of cardsList.reverse()) {
        this.cardsData.push(cardData);
        const { cardElement } = new Card(cardData, this.api);
        this.container.appendChild(cardElement);
      }
    });
  }
  // создаю карточку, рисую от новых к старым
  addCard(data) {
    const cardData = {
      name: data.name,
      link: data.link
    };
    this.api.postNewCard(cardData).then((cardData) => {
      const { cardElement } = new Card(cardData, this.api);
      this.container.insertBefore(cardElement, this.container.firstChild);
      this.cardsData.unshift(cardData);
    })
  }
  
  // дезинтегратор карточек
  removeCard(event) {
    event.stopPropagation();
    const cardId = event.target.closest('.place-card').dataset.cardId;
    console.log(cardId);
    this.api.deleteCard(cardId).then((cardsList) => {
      if (cardsList.message === 'Пост удалён') {
        event.target.closest('.place-card').remove(); // удаляю из дома сам
        this.cardsData = this.cardsData.filter(function (cardData) {
          if (cardData._id !== cardId) {
            return cardData;
          }
        })
      }
    })
  }


// метод работающий с лайками 
pushLike(event) {
  event.stopPropagation();
  let cardLike = event.target.closest('.place-card').dataset.liked;
  const cardId = event.target.closest('.place-card').dataset.cardId;
  let method = 'string'
  if (cardLike === 'true') {
    method = 'DELETE'
  } else {
    method = 'PUT'
  }
  this.api.like(cardId, method).then((resCardData) => {
    const cardElement = event.target.closest('.place-card');
    const likeCount = cardElement.querySelector('.place-card__like-count');
    const likeIcon = cardElement.querySelector('.place-card__like-icon');
    const isLiked = this.isLiked(resCardData);
    cardLike = isLiked.status;

    cardElement.dataset.liked = isLiked.status;
    if (isLiked.status) {
      this.cardsData[isLiked.number] = resCardData;
      likeIcon.classList.add('place-card__like-icon_liked');

    } else {
      likeIcon.classList.remove('place-card__like-icon_liked');
    }

    if (resCardData.likes.length > 99) {
      likeCount.textContent = '99+';
    } else {
      likeCount.textContent = resCardData.likes.length;
    }
  })
}

// штука проверяющая полайкана ли карточка этим юзером
isLiked(cardData) {
  let count = 0;
  for (let i = 0; i <= (this.cardsData.length - 1); i++) { // здесь пропадают скобки после сборки 
    if (this.cardsData[i]._id === cardData._id) {
      count = i;
      for (let j = (cardData.likes.length - 1); j >= 0; j--) { // и тут
        if (cardData.likes[j]._id === this.api.userId) {
          return { status: true, number: count }
        }
      }
      break
    }
  }
  return { status: false, number: count }
}
}

// создавальщик карточек
class Card {
  constructor(data, api) {
    this.api = api;
    this.data = data;
    this.cardElement = this.create(this.data);
  }

  create(data) {
    const cardTemplate = `
      <div class="place-card__image" style="background-image: url('${data.link}');">
        <button class="place-card__delete-icon"></button>
        </div><div class="place-card__description">
        <h3 class="place-card__name">${data.name}</h3>
        <div class="place-card__like-container">
          <button class="place-card__like-icon"></button>
          <p class="place-card__like-count"></p>
        </div>
      </div>`;
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('place-card');
    cardContainer.setAttribute('data-card-id', `${data._id}`);
    cardContainer.innerHTML = cardTemplate;
    const likeCount = cardContainer.querySelector('.place-card__like-count');
    cardContainer.querySelector('.place-card__like-icon').addEventListener('click', (event => placesList.pushLike(event)));
    cardContainer.querySelector('.place-card__delete-icon').addEventListener('click', (event => placesList.removeCard(event)));
    cardContainer.querySelector('.place-card__image').addEventListener('click', (event => popupper.open(event)));

    // рисую лайк, если каунт больше полкано этим юзером
    const isLiked = placesList.isLiked(data);
    cardContainer.setAttribute('data-liked', isLiked.status);
    if (isLiked.status) {
      cardContainer.querySelector('.place-card__like-icon').classList.add('place-card__like-icon_liked');      
    } else {
      cardContainer.querySelector('.place-card__like-icon').classList.remove('place-card__like-icon_liked');
    }
    
    // меняю большие цифры на красивые
    if (data.likes.length > 99) {
      likeCount.textContent = '99+';
    } else {
      likeCount.textContent = data.likes.length
    }
    
    
    // удаляю delete button всех карточек с чужими ownerId
    if (data.owner._id !== this.api.userId) {
      cardContainer.querySelector('.place-card__image').removeChild(cardContainer.querySelector('.place-card__delete-icon'))
    }

    return cardContainer;
  }
}

// генератор попапов
class Popup {
  constructor(popupContainer, api) {
    this.api = api;
    this.popupContainer = popupContainer;
  }
  // меняю структуру попапа от event.target, 
  create(event) {
    const popupContent = document.createElement('div');
    // попап фото
    if (event.target.classList.contains('place-card__image')) {

      const popupMarkup = `
        <img class="popup__pic" src="${event.target.style.backgroundImage.slice(5, -2)}">
        <img class="popup__close" src="./images/close.svg">`;
      popupContent.classList.add('popup__photo-content');
      popupContent.innerHTML = popupMarkup;
      popupContent.querySelector('.popup__close').addEventListener('click', () => {
        this.close();
      });
      return popupContent;
    }
    // попап добавления карточки
    else if (event.target.classList.contains('user-info__add-button')) {

      const popupMarkup = `
        <img class="popup__close" src="./images/close.svg">
        <h3 class="popup__title">Новое место</h3>
        <form class="popup__form form">
          <input class="popup__input popup__input_type-name" type="text" name="name" minlength="2" maxlength="30" required="yes" placeholder="Название">
          <span class="error error_hidden error__name">its no errors</span>
          <input class="popup__input popup__input_type-additional" type="url" name="additional" required="yes" placeholder="Ссылка на фотографию">
          <span class="error error_hidden error__additional">its no errors</span>
          <button class="button popup__button" disabled="yes" name="button" style="cursor: default;">+</button>
        </form>`;

      popupContent.classList.add('popup__content');
      popupContent.innerHTML = popupMarkup;

      popupContent.querySelector('.popup__close').addEventListener('click', () => {
        this.close();
      });
      popupContent.querySelector('.popup__input_type-name').addEventListener('input', (event) => {
        this.validate(event, popupContent.querySelector('.popup__input_type-additional'));
      });
      popupContent.querySelector('.popup__input_type-additional').addEventListener('input', (event) => {
        this.validate(event, popupContent.querySelector('.popup__input_type-name'));
      });
      // сабмит добавления карточки
      popupContent.querySelector('.popup__button').addEventListener('click', (event) => {
        event.preventDefault();
        const nawCardData = {
          name: popupContent.querySelector('.popup__input_type-name').value,
          link: popupContent.querySelector('.popup__input_type-additional').value,
          count: 0
        }
        placesList.addCard(nawCardData);
        this.close();
      });

      return popupContent;
    }
    // попап редактирования name about
    else if (event.target.classList.contains('user-info__edit-button')) {

      const popupMarkup = `
        <img class="popup__close" src="./images/close.svg">
        <h3 class="popup__title">Редактировать профиль</h3>
        <form class="popup__form form">
          <input class="popup__input popup__input_type-name" type="text" name="name" minlength="2" maxlength="30" required="yes" placeholder="Имя" value="${document.querySelector('.user-info__name').innerText}">
          <span class="error error_hidden error__name">its no errors</span>
          <input class="popup__input popup__input_type-additional" type="text" name="additional" minlength="2" maxlength="30" required="yes" placeholder="О Себе" value="${document.querySelector('.user-info__job').innerText}">
          <span class="error error_hidden error__additional">its no errors</span>
          <button class="button popup__button" disabled="yes" name="button" style="cursor: default; font-size: 18px; font-weight: bold;">Сохранить</button>
        </form>`;

      popupContent.classList.add('popup__content');
      popupContent.innerHTML = popupMarkup;

      popupContent.querySelector('.popup__close').addEventListener('click', () => {
        this.close();
      });
      popupContent.querySelector('.popup__input_type-name').addEventListener('input', (event) => {
        this.validate(event, popupContent.querySelector('.popup__input_type-additional'));
      });
      popupContent.querySelector('.popup__input_type-additional').addEventListener('input', (event) => {
        this.validate(event, popupContent.querySelector('.popup__input_type-name'));
      });
      // сабмит редактирования name about
      popupContent.querySelector('.popup__button').addEventListener('click', (event) => {
        event.preventDefault();
        this.close();
        userInfo.changeNameAbout({ name: popupContent.querySelector('.popup__input_type-name').value, about: popupContent.querySelector('.popup__input_type-additional').value });
      });
      return popupContent;
    }
    // попап редактирования юзер-пика
    else if (event.target.classList.contains('user-info__photo')) {

      const popupMarkup = `
        <img class="popup__close" src="./images/close.svg">
        <h3 class="popup__title">Обновить фотографию</h3>
        <form class="popup__form form">
          <input class="popup__input popup__input_type-additional" type="url" name="additional" required="yes" placeholder="Ссылка на фотографию">
          <span class="error error_hidden error__additional">its no errors</span>
          <button class="button popup__button" disabled="yes" name="button" style="cursor: default; font-size: 18px; font-weight: bold;">Сохранить</button>
        </form>`;

      popupContent.classList.add('popup__content');
      popupContent.innerHTML = popupMarkup;

      popupContent.querySelector('.popup__close').addEventListener('click', () => {
        this.close();
      });

      popupContent.querySelector('.popup__input_type-additional').addEventListener('input', (event) => {
        this.validateInput(event);
      });

      // сабмит редактирования юзер-пика
      popupContent.querySelector('.popup__button').addEventListener('click', (event) => {
        event.preventDefault();
        userInfo.changeUserPic({ avatar: popupContent.querySelector('.popup__input_type-additional').value });
        this.close();
      });

      return popupContent;
    }
  }

  open(event) {
    this.popupContainer.appendChild(this.create(event));
    this.popupContainer.classList.toggle('is-opened');
    document.body.classList.add('body-fixed'); // хотел запретить scroll body, пока открыт попап
  }
  close() {
    this.popupContainer.classList.toggle('is-opened');
    this.popupContainer.innerHTML = '';
    document.body.classList.remove('body-fixed'); // но не смог
  }
  // валидация, надо переделать на основе validateInput
  validate(event, element) {
    const somePopupButton = document.querySelector('.popup__button');
    const someError = document.querySelector(`.error__${event.target.name}`);
    const otherPopupInputValid = element.validity.valid;
    let thisPopupInputValid = event.target.validity.valid;

    if (thisPopupInputValid && otherPopupInputValid) {
      someError.classList.add('error_hidden');
      someError.textContent = 'no errors';
      somePopupButton.removeAttribute('disabled');
      somePopupButton.style.backgroundColor = 'black';
      somePopupButton.style.color = 'white';
      somePopupButton.style.cursor = 'pointer';
    }
    else {
      someError.textContent = event.target.validationMessage;
      someError.classList.remove('error_hidden');
      somePopupButton.setAttribute('disabled', 'yes');
      somePopupButton.style.backgroundColor = 'white';
      somePopupButton.style.color = 'rgba(0, 0, 0, .2)';
      somePopupButton.style.cursor = 'default';
    }
  }
  // валидирует инпут
  validateInput(event) {

    const somePopupButton = document.querySelector('.popup__button');
    const someError = document.querySelector(`.error__${event.target.name}`);

    if (event.target.validity.valid) {
      someError.classList.add('error_hidden');
      someError.textContent = 'no errors';
      somePopupButton.removeAttribute('disabled');
      somePopupButton.style.backgroundColor = 'black';
      somePopupButton.style.color = 'white';
      somePopupButton.style.cursor = 'pointer';
    }
    else {
      someError.textContent = event.target.validationMessage;
      someError.classList.remove('error_hidden');
      somePopupButton.setAttribute('disabled', 'yes');
      somePopupButton.style.backgroundColor = 'white';
      somePopupButton.style.color = 'rgba(0, 0, 0, .2)';
      somePopupButton.style.cursor = 'default';
    }
  }
}

const serverUrl = NODE_ENV === 'development' ? 'http://praktikum.tk/cohort4' : 'https://praktikum.tk/cohort4'
const options = { url: serverUrl, token: '01ae8842-bd3d-421f-aca3-5f8ed5caf81a' }

const api = new Api(options);
const userInfo = new UserInfo(api);
const placesList = new CardList(document.querySelector('.places-list'), api);
const popupper = new Popup(document.querySelector('.popup'), api)

// рисую юзера на старте
userInfo.load();

// рисую карточки на старте
placesList.render();

// развешиваю попапы
document.querySelector('.user-info__edit-button').addEventListener('click', (event => popupper.open(event)));
document.querySelector('.user-info__add-button').addEventListener('click', (event => popupper.open(event)));
document.querySelector('.user-info__photo').addEventListener('click', (event => popupper.open(event)));