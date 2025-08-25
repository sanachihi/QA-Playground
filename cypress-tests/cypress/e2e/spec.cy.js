/// <reference types="cypress" />

describe('TodoMVC (Vue - build)', () => {
  const URL = 'https://todomvc.com/examples/vue/dist/'

  it('ajoute deux todos', () => {
    cy.visit(URL)
    cy.contains('Double-click to edit a todo', { timeout: 10000 }).should('be.visible')

    cy.get('input.new-todo')
      .type('Acheter du lait{enter}')
      .type('Lire un livre{enter}')

    cy.get('.todo-list li').should('have.length', 2)
    cy.get('.todo-list li').first().should('contain.text', 'Acheter du lait')
    cy.get('.todo-list li').eq(1).should('contain.text', 'Lire un livre')
    cy.get('.todo-count strong').should('have.text', '2') // compteur robuste
  })

  it('complète, filtre et nettoie', () => {
    cy.visit(URL)
    cy.contains('Double-click to edit a todo', { timeout: 10000 }).should('be.visible')

    // créer le jeu de données
    cy.get('input.new-todo')
      .type('Acheter du lait{enter}')
      .type('Lire un livre{enter}')

    // compléter la première todo (forcer le check sur l'input)
    cy.contains('li', 'Acheter du lait')
      .as('item1')
      .find('input.toggle')
      .check({ force: true })

    // vérifier l’état "completed" + compteur
    cy.get('@item1').should('have.class', 'completed')
    cy.get('.todo-count strong').should('have.text', '1')

    // Filtre Active
    cy.contains('a', 'Active').click()
    cy.get('.todo-list li')
      .should('have.length', 1)
      .first()
      .should('contain.text', 'Lire un livre')
      .and('not.have.class', 'completed')

    // Filtre Completed
    cy.contains('a', 'Completed').click()
    cy.get('.todo-list li.completed')
      .should('have.length', 1)
      .first()
      .should('contain.text', 'Acheter du lait')

    // Clear completed (le bouton existe seulement s'il y a des complétées)
    cy.get('button.clear-completed').should('be.visible').click()

    // Retour "All" et vérifie qu’il ne reste que la todo active
    cy.contains('a', 'All').click()
    cy.get('.todo-list li')
      .should('have.length', 1)
      .first()
      .should('contain.text', 'Lire un livre')
    cy.get('.todo-count strong').should('have.text', '1')
  })

  it('supprime une todo', () => {
    cy.visit(URL)
    cy.contains('Double-click to edit a todo', { timeout: 10000 }).should('be.visible')

    cy.get('input.new-todo').type('À supprimer{enter}')

    // survol pour afficher le bouton .destroy, puis clic
    cy.contains('li', 'À supprimer').as('toDelete')
    cy.get('@toDelete').trigger('mouseover')
    cy.get('@toDelete').find('button.destroy').click({ force: true })

    cy.get('.todo-list li').should('have.length', 0)
  })
})
