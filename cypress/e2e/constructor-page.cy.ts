const BASE_URL = 'http://localhost:4000';

// Селекторы
const selectors = {
  modal: '[data-cy="modal_ingredient"]',
  bunItem: '[data-cy="bun_0"]',
  modalHeader: '[data-cy="ingredient_modal"] > .text_type_main-medium',
  overlay: '[data-cy="modal_overlay"]',
  closeModalBtn: '[data-cy="btn_close_modal"]',
  clearTopBun: '[data-cy="bun_constructor_item_up_clear"]',
  clearBottomBun: '[data-cy="bun_constructor_item_down_clear"]',
  addedIngredient: '[data-cy="ingredient_constructor_item"]',
  ingredientMain: '[data-cy="ingredient_0"]',
  addIngredientButton: '.common_button',
  orderButton: '[data-cy="new_order_btn"]',
  orderNumber: '[data-cy="new_order_number"]'
};

beforeEach(() => {
  localStorage.setItem('refreshToken', 'testRefreshToken');
  cy.setCookie('accessToken', 'testAccessToken');

  cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' }).as('loadIngredients');
  cy.intercept('GET', 'api/auth/user', { fixture: 'user' }).as('loadUser');

  cy.visit(BASE_URL);
  cy.wait('@loadIngredients');
  cy.wait('@loadUser');
});

afterEach(() => {
  cy.clearAllCookies();
  cy.clearAllLocalStorage();
});

describe('Доступность приложения', () => {
  it('Страница доступна по адресу', () => {
    cy.visit(BASE_URL);
  });
});

describe('Проверка интерфейса конструктора', () => {
  it('Добавление ингредиентов в бургер', () => {
    cy.get(selectors.clearTopBun).should('exist');
    cy.get(selectors.clearBottomBun).should('exist');
    cy.get(selectors.addedIngredient).should('not.exist');

    cy.get(selectors.bunItem).find(selectors.addIngredientButton).click();
    cy.get(selectors.ingredientMain).should('exist');
    cy.get(':nth-child(4)').find(selectors.ingredientMain).find(selectors.addIngredientButton).click();

    cy.get('[data-cy="bun_constructor_item_up"]').should('exist');
    cy.get('[data-cy="bun_constructor_item_down"]').should('exist');
    cy.get(selectors.addedIngredient).should('exist');
  });
});

describe('Модальное окно ингредиента', () => {
  const expectedIngredient = 'Краторная булка N-200i';

  it('Открытие и закрытие по клику вне окна', () => {
    cy.get(selectors.modal).should('not.exist');
    cy.get(selectors.bunItem).click();
    cy.get(selectors.modal).should('be.visible');
    cy.get(selectors.modalHeader).should('contain.text', expectedIngredient);
    cy.get(selectors.overlay).click({ force: true });
    cy.get(selectors.modal).should('not.exist');
  });

  it('Открытие и закрытие по кнопке', () => {
    cy.get(selectors.bunItem).click();
    cy.get(selectors.modalHeader).should('contain.text', expectedIngredient);
    cy.get(selectors.closeModalBtn).click();
    cy.get(selectors.modal).should('not.exist');
  });
});

describe('Процесс заказа', () => {
  it('Проверка оформления заказа', () => {
    cy.get(selectors.clearTopBun).should('exist');
    cy.get(selectors.clearBottomBun).should('exist');
    cy.get(selectors.addedIngredient).should('not.exist');

    cy.get(selectors.bunItem).find(selectors.addIngredientButton).click();
    cy.get(':nth-child(4)').find(selectors.ingredientMain).find(selectors.addIngredientButton).click();

    cy.intercept('POST', 'api/orders', { fixture: 'newOrder' }).as('submitOrder');

    cy.get(selectors.orderButton).click();
    cy.wait('@submitOrder');

    cy.fixture('newOrder').then((orderData) => {
      cy.get(selectors.orderNumber).should('contain', orderData.order.number);
    });

    cy.wait(1000);
    cy.get(selectors.closeModalBtn).click();

    cy.get(selectors.clearTopBun).should('exist');
    cy.get(selectors.clearBottomBun).should('exist');
    cy.get(selectors.addedIngredient).should('not.exist');
  });
});
