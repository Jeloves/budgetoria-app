describe('Test', () => {
    it('passes', () => {
        cy.task('createNewBudget').then(data => {
            expect(data).to.exist;
          });
    })
  })