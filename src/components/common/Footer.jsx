import "../../App.css"

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Get the current year dynamically

  return (
    <footer className="footer">
      <p>&copy; {currentYear} Malik Awan Real Estate. All rights reserved.</p>
    </footer>
  );
};

export default Footer;