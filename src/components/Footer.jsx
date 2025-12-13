import React from 'react';

const Footer = () => {
  const styles = {
    footer: {
      background: '#003d7a',
      color: 'white',
      padding: '3rem 2rem 1rem',
      marginTop: '4rem'
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem',
      marginBottom: '2rem'
    },
    section: {
      
    },
    heading: {
      marginBottom: '1rem',
      fontSize: '1.3rem'
    },
    paragraph: {
      margin: '0.5rem 0'
    },
    bottom: {
      textAlign: 'center',
      paddingTop: '2rem',
      borderTop: '1px solid rgba(255, 255, 255, 0.2)'
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.content}>
        <div style={styles.section}>
          <h4 style={styles.heading}>Contact Us</h4>
          <p style={styles.paragraph}>📞 0768 323 230</p>
          <p style={styles.paragraph}>📱 0788 351 350</p>
          <p style={styles.paragraph}>📧 walkercleanersltd@gmail.com</p>
          <p style={styles.paragraph}>📍 Greec Towers Ruiru</p>
        </div>
        <div style={styles.section}>
          <h4 style={styles.heading}>Follow Us</h4>
          <p style={styles.paragraph}>Instagram: @walkercleaners</p>
          <p style={styles.paragraph}>Facebook: walkercleaners</p>
          <p style={styles.paragraph}>Twitter: walkercleaners</p>
        </div>
      </div>
      <div style={styles.bottom}>
        <p>&copy; 2024 Walker Cleaners. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;