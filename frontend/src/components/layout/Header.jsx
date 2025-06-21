import logo from '../../assets/logo.png';
import './Header.css';

function Header() {
  return (
    <div className="header-container">
      <img src={logo} alt="Logo" className="header-logo"/>
      <span className="header-title">Auction Online</span>
    </div>
  );
}

export default Header;