describe('Search Page', () => {
  beforeEach(() => {
    // Intercept the GraphQL query to provide mock data
    cy.intercept('POST', 'http://localhost:4000/api/graphql', (req) => {
      if (req.body.operationName === 'SearchConcerts') {
        req.reply({
          data: {
            concerts: {
              concerts: [
                { id: '1', name: 'Test Concert', date: '2025-10-20T00:00:00.000Z', image: '', mainArtist: { name: 'Artist' }, venue: 'Venue', ticketCategories: [] },
                { id: '2', name: 'Another Concert', date: '2025-10-22T00:00:00.000Z', image: '', mainArtist: { name: 'Artist 2' }, venue: 'Venue 2', ticketCategories: [] },
              ],
            },
          },
        });
      }
    }).as('searchConcerts');
    cy.visit('/search');
  });

  it('should load the search page', () => {
    cy.url().should('include', '/search');
  });

  it('should display search input', () => {
    cy.get('input[placeholder="Хайлт..."]').should('be.visible');
  });

  it('should display navigation bar', () => {
    cy.contains('TICKET BOOKING').should('be.visible');
  });

  it('should allow entering search query', () => {
    cy.get('input[placeholder="Хайлт..."]').type('music').should('have.value', 'music');
  });

  it('should display date filter button and open panel on click', () => {
    const date1 = new Date('2025-10-20T00:00:00.000Z').toLocaleDateString('mn-MN');
    const date2 = new Date('2025-10-22T00:00:00.000Z').toLocaleDateString('mn-MN');
    cy.contains('Огноо').should('be.visible').click();
    cy.contains(date1).should('be.visible');
    cy.contains(date2).should('be.visible');
  });

  it('should filter by date when a date is selected', () => {
    const date1 = new Date('2025-10-20T00:00:00.000Z').toLocaleDateString('mn-MN');
    cy.contains('Огноо').click();
    cy.contains(date1).click();
    cy.get('button').contains(date1).should('be.visible');
    cy.get('body').find('div[class*="DateSelectionPanel"]').should('not.exist');
  });
});
