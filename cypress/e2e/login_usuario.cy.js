describe('Login de usuario registrado', () => {
  it('Debe iniciar sesión correctamente con credenciales válidas', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Ingresar').click();
    cy.get('input[name="email"]').type('ramiresosssamariavaleria@gmail.com');
    cy.get('input[name="password"]').type('N9$9h81yAYSn');
    cy.get('button').contains('Ingresar').click(); 
    cy.contains('dashboard').should('exist'); 
  });
});