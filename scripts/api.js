export class Api {
    constructor(options) {
      this.url = options.url;
      this.token = options.token;
      this.userId = '';
    }
    // получить профиль
    getUserData() {
      return fetch(`${this.url}/users/me`, {
        headers: {
          authorization: this.token
        }
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          return Promise.reject(`Ошибка: ${res.status}`)
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // изменить профиль name about
    patchUserData(data) {
      return fetch(`${this.url}/users/me`, {
        method: 'PATCH',
        headers: {
          // authorization: '01ae8842-bd3d-421f-aca3-5f8ed5caf81b', // - error test
          authorization: this.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(resUserData => {
          if (resUserData.ok) {
            return resUserData.json();
          }
          return Promise.reject(`Ошибка: ${resUserData.status}`)
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // изменить профиль pic
    patchUserPic(data) {
      return fetch(`${this.url}/users/me/avatar`, {
        method: 'PATCH',
        headers: {
          authorization: this.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(resUserData => {
          if (resUserData.ok) {
            return resUserData.json();
          }
          return Promise.reject(`Ошибка: ${resUserData.status}`)
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // получить карточки
    getCardList() {
      return fetch(`${this.url}/cards`, {
        headers: {
          authorization: this.token
        }
      })
        .then(resCardList => {
          if (resCardList.ok) {
            return resCardList.json();
          }
          return Promise.reject(`Ошибка: ${resCardList.status}`)
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // добавляем новую карточку на серв
    postNewCard(data) {
      return fetch(`${this.url}/cards`, {
        method: 'POST',
        headers: {
          authorization: this.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(resCardData => {
          if (resCardData.ok) {
            return resCardData.json();
          }
          return Promise.reject(`Ошибка: ${resCardData.status}`)
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // вернет карточки без удаленной id
    deleteCard(cardId) {
      return fetch(`${this.url}/cards/${cardId}`, {
        method: 'DELETE',
        headers: {
          authorization: this.token,
          'Content-Type': 'application/json'
        }
      })
        .then(deletStatus => {
          if (deletStatus.ok) {
            return deletStatus.json();
          }
          return Promise.reject(`Ошибка: ${deletStatus.status}`)
        })
        .catch((err) => {
          console.log(err);
        });
    }
    like(cardId, method) {
      return fetch(`${this.url}/cards/like/${cardId}`, {
        method: method,
        headers: {
          authorization: this.token,
          'Content-Type': 'application/json'
        }
      })
        .then(cardData => {
          if (cardData.ok) {
            return cardData.json();
          }
          return Promise.reject(`Ошибка: ${cardData.status}`)
        })
        .catch((err) => {
          console.log(err);
        });
    }
  
    delLike(cardId) {
      return fetch(`${this.url}/cards/like/${cardId}`, {
        method: 'DELETE',
        headers: {
          authorization: this.token,
          'Content-Type': 'application/json'
        }
      })
        .then(cardData => {
          if (cardData.ok) {
            return cardData.json();
          }
          return Promise.reject(`Ошибка: ${cardData.status}`)
        })
        .catch((err) => {
          console.log(err);
        });
    } 
  
    fetchLike(cardId, method) {
      return fetch(`${this.url}/cards/like/${cardId}`, {
        method: method,
        headers: {
          authorization: this.token,
          'Content-Type': 'application/json'
        }
      })
        .then(cardData => {
          if (cardData.ok) {
            return cardData.json();
          }
          return Promise.reject(`Ошибка: ${cardData.status}`)
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }