import logo from '../../assets/images/logo.png';
import './Header.css';

function Header() {
  return (
    <div className="header-container">
      <div className="header-left">
        
      </div>
      <div className="header-center">
        <span className="header-title">Auction Online</span>
      </div>
      <div className="header-right">
        <img src={logo} alt="Logo" className="header-logo" />
      </div>
    </div>
  );
}

export default Header;