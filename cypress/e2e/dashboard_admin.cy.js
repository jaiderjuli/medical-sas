describe('Login de usuario registrado', () => {
  it('Debe iniciar sesión correctamente con credenciales válidas', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Ingresar').click();
    cy.get('input[name="email"]').type('medicalcol.sas@gmail.com');
    cy.get('input[name="password"]').type('admin123@@');
    cy.get('button').contains('Ingresar').click(); 
    cy.contains('admin').should('exist'); 
  });
});