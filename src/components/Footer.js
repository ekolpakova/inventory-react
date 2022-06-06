import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import TelegramIcon from "@mui/icons-material/Telegram";

import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footerUpper">
        <div className="logo">
          <SettingsApplicationsIcon className="icon" />
          <div>InventoryApp</div>
        </div>
        <div>Ссылка на Google Play</div>
      </div>

      <div className="socials">
        <TwitterIcon className="icon" />
        <FacebookIcon className="icon" />
        <TelegramIcon className="icon" />
      </div>

      <div>Все права защищены</div>
    </footer>
  );
};

export default Footer;
