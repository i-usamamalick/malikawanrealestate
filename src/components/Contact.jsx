import "../App.css";
import { FaEnvelope, FaPhone } from "react-icons/fa"; // Importing icons

const Contact = () => {
  return (
    <div className="card">
      <div className="contact-container">
        <div className="contact-details">
          <h2>Contact Us</h2>
          <p>
            <FaEnvelope className="contact-icon" /> 
            Email: <a href="mailto:saeedmalik12512@gmail.com">saeedmalik12512@gmail.com</a>
          </p>
          <p>
            <FaPhone className="contact-icon" /> 
            Phone: <a href="tel:+923219490736">+923219490736</a>, <a href="tel:+923334904855">+923334904855</a>
          </p>
        </div>
        
        <div className="contact-map">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d291.8807663943219!2d74.38228467473162!3d31.578573193866333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39191b005cfef501%3A0x42be0e13d2513b05!2sMalik%20Awan%20Real%20Estate!5e0!3m2!1sen!2s!4v1746519952631!5m2!1sen!2s"
            width="100%"
            height="300"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
