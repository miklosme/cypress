
context('Actions', () => {
  beforeEach(() => {
    cy.visit('https://localhost:9990')
  })

  // https://on.cypress.io/interacting-with-elements

  it('.type() - type into a DOM element', () => {
    // https://on.cypress.io/type
    cy.get('.action-email')
      .type('fake@email.com').should('have.value', 'fake@email.com')
  })
})
