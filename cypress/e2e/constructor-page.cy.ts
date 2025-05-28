// cypress/e2e/burgerConstructor.cy.ts
const LOCAL_URL = 'http://localhost:4000';

const SELECTORS = {
  modalIngredient: '[data-cy="modal_ingredient"]',
  bunFirst: '[data-cy="bun_0"]',
  ingredientHeader: '[data-cy="ingredient_modal"] > .text_type_main-medium',
  overlay: '[data-cy="modal_overlay"]',
  modalCloseBtn: '[data-cy="btn_close_modal"]',
  orderButton: '[data-cy="new_order_btn"]',
  orderNumber: '[data-cy="new_order_number"]',
  constructorBunTopEmpty: '[data-cy="bun_constructor_item_up_clear"]',
  constructorBunBottomEmpty: '[data-cy="bun_constructor_item_down_clear"]',
  constructorIngredientItem: '[data-cy="ingredient_constructor_item"]',
  ingredientButton: (id: number = 0) => `[data-cy="ingredient_${id}"] .common_button`
};

describe('🚀 Проверка интерфейса конструктора бургеров', () => {
  before(() => {
    cy.visit(LOCAL_URL);
  });

  beforeEach(() => {
    localStorage.setItem('refreshToken', 'testRefreshToken');
    cy.setCookie('accessToken', 'testAccessToken');

    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' }).as('loadIngredients');
    cy.intercept('GET', 'api/auth/user', { fixture: 'user' }).as('loadUser');

    cy.visit(LOCAL_URL);
    cy.wait('@loadIngredients');
    cy.wait('@loadUser');
  });

  afterEach(() => {
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
  });

  it('🌐 Приложение должно быть доступно по URL', () => {
    cy.url().should('include', 'localhost');
  });

  it('🧱 Добавление ингредиентов в конструктор', () => {
    cy.get(SELECTORS.constructorBunTopEmpty).should('exist');
    cy.get(SELECTORS.constructorBunBottomEmpty).should('exist');
    cy.get(SELECTORS.constructorIngredientItem).should('not.exist');

    cy.get(`${SELECTORS.bunFirst} .common_button`).click();
    cy.get(SELECTORS.ingredientButton(0)).click();

    cy.get('[data-cy="bun_constructor_item_up"]').should('exist');
    cy.get('[data-cy="bun_constructor_item_down"]').should('exist');
    cy.get(SELECTORS.constructorIngredientItem).should('exist');
  });

  it('🔍 Модальное окно ингредиента (закрытие через оверлей)', () => {
    const expectedTitle = 'Краторная булка N-200i';

    cy.get(SELECTORS.modalIngredient).should('not.exist');
    cy.get(SELECTORS.bunFirst).click();

    cy.get(SELECTORS.modalIngredient).should('be.visible');
    cy.get(SELECTORS.ingredientHeader).should('contain', expectedTitle);

    cy.get(SELECTORS.overlay).click({ force: true });
    cy.get(SELECTORS.modalIngredient).should('not.exist');
  });

  it('❌ Модальное окно ингредиента (закрытие по кнопке)', () => {
    cy.get(SELECTORS.bunFirst).click();
    cy.get(SELECTORS.modalCloseBtn).click();
    cy.get(SELECTORS.modalIngredient).should('not.exist');
  });

  it('✅ Полный процесс заказа', () => {
    cy.get(SELECTORS.constructorBunTopEmpty).should('exist');
    cy.get(`${SELECTORS.bunFirst} .common_button`).click();
    cy.get(SELECTORS.ingredientButton(0)).click();

    cy.intercept('POST', 'api/orders', { fixture: 'newOrder' }).as('sendOrder');

    cy.get(SELECTORS.orderButton).click();
    cy.wait('@sendOrder');

    cy.fixture('newOrder').then((data) => {
      cy.get(SELECTORS.orderNumber).should('contain', data.order.number);
    });

    cy.wait(1000); // дождаться закрытия

    cy.get(SELECTORS.constructorBunTopEmpty).should('exist');
    cy.get(SELECTORS.constructorIngredientItem).should('not.exist');
    cy.get(SELECTORS.modalCloseBtn).click();
  });
});
