import logo from '../../assets/images/logo.png';
import './Header.css';
import RealTime from "../ui/realtime";
function Header() {
  return (
    <div className="header-container">
      <div className="header-left">
        <img src={logo} alt="Logo" className="header-logo" />
      </div>
      <div className="header-center">
        <span className="header-title">Auction Online</span>
      </div>
      <div className="header-right">
        <RealTime/>
      </div>
    </div>
  );
}

export default Header;