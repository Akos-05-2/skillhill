describe('Bejelentkezés tesztelése, regisztráció tesztelése', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/api/auth/signin');
  });

  it('Be kell jelentkeznie a gomb megnyomásával', () => {
    cy.get('button[type="submit"]').click();

    cy.url().should('eq', 'http://localhost:3000');
    cy.should('be.visible', 'Bejelentkezés');
  });
});

describe('Kijelentkezés tesztelése', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/api/auth/signout');
  });

  it('Be kell jelentkeznie a gomb megnyomásával', () => {
    cy.get('button[type="submit"]').click();

    cy.url().should('eq', 'http://localhost:3000');
    cy.should('be.visible', 'Bejelentkezés');
  });
});

describe('Adatbázis url tesztelése', () => {
  it('Megfelelő adatbázis url formátumot teszteli', () => {
    const databaseUrl = process.env.DATABASE_URL;
    const dbUrlPattern = /^([a-zA-Z]+):\/\/([a-zA-Z0-9_-]+):([a-zA-Z0-9_-]+)@([a-zA-Z0-9._-]+):([0-9]+)\/([a-zA-Z0-9_-]+)$/;
    
    expect(databaseUrl).to.match(dbUrlPattern);
  });
});

describe('SECRET azonosító tesztelése', () => {
  it('megfelelő SECERT formátum', () => {
    const secretKey = process.env.GOOGLE_SECRET_ID;
    const jwtPattern = /^[A-Za-z0-9\-_=]+(\.[A-Za-z0-9\-_=]+){2}$/;

    expect(secretKey).to.match(jwtPattern);
  });
});

describe('GOOGLE azonosító tesztelése', () => {
  it('Megfelelő formátum tesztelése', () => {
    const apiKey = process.env.GOOGLE_ID;
    const apiKeyPattern = /^AIza[0-9A-Za-z\-_]{35}$/;
    expect(apiKey).to.match(apiKeyPattern);
  });
});

describe('HOST és PORT tesztelése', () => {
  it('should have a valid HOST format', () => {
    const host = process.env.HOST;
    const ipPattern = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const domainPattern = /^([a-zA-Z0-9-]+\.)+[a-zA-Z0-9-]{2,}$/;
    expect(host).to.match(ipPattern || domainPattern);
  });

  it('megfelelő PORT szám', () => {
    const port = process.env.PORT;
    const portPattern = /^(6553[0-5]|655[0-2][0-9]|65[0-9]{3}|6[0-9]{4}|[1-5]?[0-9]{1,4})$/;

    expect(port).to.match(portPattern);
  });
});

describe('offline állapot tesztelése', () => {
  it('hibaüzenet ha offline', () => {
    cy.intercept('*', {
      forceNetworkError: true,
    }).as('offlineRequest');
    cy.visit('http://localhost:3000');
    cy.contains('You are offline').should('be.visible');
  });
});
