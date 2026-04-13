import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="footer__brand-name">AlienwareCommunity</div>
            <p className="footer__brand-desc">An independent fan-run community for Alienware enthusiasts. Not affiliated with Dell or Alienware.</p>
          </div>
          <div>
            <div className="footer__col-title">Navigate</div>
            <ul className="footer__links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/forum">Forum</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/downloads">Downloads</Link></li>
              <li><Link to="/history">History</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer__col-title">Community</div>
            <ul className="footer__links">
              <li><Link to="/login?tab=register">Register</Link></li>
              <li><Link to="/login">Sign In</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer__col-title">Resources</div>
            <ul className="footer__links">
              <li><Link to="/downloads">Downloads</Link></li>
              <li><Link to="/history">History</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <div className="footer__legal">
            © 2024 AlienwareCommunity Fan Site · Not affiliated with Dell or Alienware
          </div>
        </div>
      </div>
    </footer>
  )
}
