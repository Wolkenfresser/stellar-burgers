// burgerConstructor.spec.ts

describe('Поведение конструктора бургеров', () => {
    const selectors = {
        modal: '[data-cy="modal"]',
        overlay: '[data-cy="modal-overlay"]',
        bunBlock: '[data-cy="bun"]',
        fillBlock: '[data-cy="ingredients"]',
        topBun: '[data-cy="bun-constructor"]',
        fillingArea: '[data-cy="ingredients-constructor"]',
    };

    const labels = {
        bunName: 'Краторная булка N-200i',
        meat: 'Филе Люминесцентного тетраодонтимформа',
        sauce: 'Соус традиционный галактический',
    };

    const setupRoutesAndVisit = () => {
        cy.fixture('ingredients.json').then((ingredients) => {
            cy.intercept('GET', 'api/ingredients', { statusCode: 200, body: ingredients });
        });

        cy.fixture('user.json').then((user) => {
            cy.intercept('GET', 'api/auth/user', { statusCode: 200, body: user });
        });

        cy.fixture('order.json').then((order) => {
            cy.intercept('POST', 'api/orders', { statusCode: 200, body: order }).as('orderRequest');
        });

        cy.setCookie('accessToken', 'exampleAccessToken');
        cy.setCookie('refreshToken', 'exampleRefreshToken');

        cy.visit(Cypress.config('baseUrl')!);
    };

    const addIngredient = (name: string) => {
        cy.contains('li', name).contains('Добавить').click();
    };

    beforeEach(setupRoutesAndVisit);

    context('Модальное окно ингредиента', () => {
        it('Открытие и закрытие модального окна по кнопке и по фону', () => {
            cy.contains('li', labels.bunName).click();
            cy.get(selectors.modal).should('contain', labels.bunName);
            cy.get(selectors.modal).find('button').click();
            cy.get(selectors.modal).should('not.exist');

            cy.contains('li', labels.meat).click();
            cy.get(selectors.modal).should('contain', labels.meat);
            cy.get(selectors.overlay).click({ force: true });
            cy.get(selectors.modal).should('not.exist');
        });
    });

    it('Булка добавляется в начало и конец конструктора', () => {
        cy.get(selectors.topBun).should('not.contain', labels.bunName);
        addIngredient(labels.bunName);
        cy.get(selectors.bunBlock).should('contain', labels.bunName);
    });

    it('Добавление ингредиентов и соуса внутрь бургера', () => {
        addIngredient(labels.bunName);
        cy.get(selectors.bunBlock).should('contain', labels.bunName);

        addIngredient(labels.meat);
        cy.get(selectors.fillBlock).should('contain', labels.meat);

        addIngredient(labels.sauce);
        cy.get(selectors.fillBlock).should('contain', labels.sauce);
    });

    describe('Завершение заказа', () => {
        const completeOrderFlow = () => {
            addIngredient(labels.bunName);
            addIngredient(labels.meat);
            addIngredient(labels.sauce);
        };

        it('Корректное оформление и очистка конструктора', () => {
            completeOrderFlow();

            cy.contains('button', 'Оформить заказ').click();
            cy.wait('@orderRequest');
            cy.get(selectors.modal).should('contain', '12345');
            cy.get(selectors.modal).find('button').click();
            cy.get(selectors.modal).should('not.exist');

            cy.get(selectors.topBun).should('contain', 'Выберите булки');
            cy.get(selectors.fillingArea).should('contain', 'Выберите начинку');
        });

        afterEach(() => {
            cy.clearCookies();
        });
    });
});
