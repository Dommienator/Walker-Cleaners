import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const scrollToSection = (id) => {
    if (!isHomePage) {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleBlogClick = () => {
    // Replace with your WordPress blog URL when ready
    window.open('https://your-blog-url.com', '_blank');
  };

  const handleBookClick = () => {
    navigate('/book');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const styles = {
    header: {
      background: 'linear-gradient(135deg, #0066cc 0%, #003d7a 100%)',
      color: 'white',
      paddingBottom: isHomePage ? '4rem' : '2rem'
    },
    headerContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      flexWrap: 'wrap',
      gap: '1rem'
    },
    logo: {
      height: '60px',
      width: 'auto',
      cursor: 'pointer'
    },
    navSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '2rem'
    },
    navLinks: {
      display: 'flex',
      gap: '2rem'
    },
    link: {
      color: 'white',
      textDecoration: 'none',
      fontSize: '1.1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'opacity 0.3s'
    },
    bookButton: {
      background: 'white',
      color: '#0066cc',
      border: 'none',
      padding: '0.7rem 1.5rem',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    heroSection: {
      textAlign: 'center',
      padding: '3rem 2rem',
      maxWidth: '800px',
      margin: '0 auto'
    },
    h1: {
      fontSize: '3.5rem',
      marginBottom: '1rem',
      fontWeight: 'bold'
    },
    tagline: {
      fontSize: '1.8rem',
      marginBottom: '1rem',
      fontWeight: '600'
    },
    subtitle: {
      fontSize: '1.2rem',
      opacity: '0.9'
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.headerContent}>
        <img 
          src="/logo.png" 
          alt="Walker Cleaners" 
          style={styles.logo}
          onClick={handleLogoClick}
        />
        <div style={styles.navSection}>
          <nav style={styles.navLinks}>
            <a onClick={() => scrollToSection('services')} style={styles.link}>Services</a>
            <a onClick={() => scrollToSection('packages')} style={styles.link}>Packages</a>
            <a onClick={handleBlogClick} style={styles.link}>Blog</a>
          </nav>
          <button onClick={handleBookClick} style={styles.bookButton}>
            <FaCalendarAlt /> Book Now
          </button>
        </div>
      </div>
      {isHomePage && (
        <div style={styles.heroSection}>
          <h1 style={styles.h1}>Walker Cleaners</h1>
          <p style={styles.tagline}>Your Mess Is Our Mission</p>
          <p style={styles.subtitle}>Professional cleaning services for homes, offices, and vehicles</p>
        </div>
      )}
    </header>
  );
};

export default Header;