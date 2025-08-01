import React from 'react';
import '../assets/footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <span>© {new Date().getFullYear()} Medical SAS. Todos los derechos reservados.</span>
    </div>
  </footer>
);

export default Footer;
