import React, { useState } from 'react';
import { FaPhone, FaWhatsapp, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PackageCard = ({ package: pkg }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const handleCall = () => {
    window.location.href = 'tel:+254768323230';
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi, I'd like to enquire about ${pkg.title}`);
    window.open(`https://wa.me/254768323230?text=${message}`, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Enquiry about ${pkg.title}`);
    const body = encodeURIComponent(`Hi,\n\nI'd like to enquire about ${pkg.title}.\n\nThank you.`);
    window.location.href = `mailto:walkercleanersltd@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleBook = () => {
    navigate(`/book?type=package&id=${pkg.id}&name=${encodeURIComponent(pkg.title)}`);
  };

  const handleViewDetails = () => {
    navigate(`/package/${pkg.id}`);
  };

  const images = pkg.images || [];

  const styles = {
    card: {
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: isHovered ? '0 8px 12px rgba(0, 0, 0, 0.15)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s',
      display: 'flex',
      flexDirection: 'column',
      transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
      cursor: 'pointer'
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: '250px',
      background: 'linear-gradient(135deg, #0066cc 0%, #003d7a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    imageNav: {
      position: 'absolute',
      bottom: '10px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '8px'
    },
    dot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.5)',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    activeDot: {
      background: 'white',
      width: '24px',
      borderRadius: '4px'
    },
    content: {
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    title: {
      color: '#003d7a',
      fontSize: '1.8rem',
      margin: 0,
      fontStyle: 'italic',
      textAlign: 'center'
    },
    includesTitle: {
      color: '#0066cc',
      marginBottom: '0.5rem',
      fontSize: '1.1rem'
    },
    list: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    listItem: {
      padding: '0.3rem 0',
      paddingLeft: '1.5rem',
      position: 'relative'
    },
    bullet: {
      position: 'absolute',
      left: 0,
      color: '#a02d6f'
    },
    description: {
      color: '#555',
      lineHeight: '1.6',
      fontStyle: 'italic'
    },
    bookButton: {
      background: '#0066cc',
      color: 'white',
      border: 'none',
      padding: '0.8rem 1.5rem',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.3s',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      justifyContent: 'center'
    },
    contactButtons: {
      display: 'flex',
      gap: '0.5rem',
      justifyContent: 'center',
      marginTop: '1rem'
    },
    iconButton: {
      background: 'none',
      border: '2px solid',
      cursor: 'pointer',
      fontSize: '1.2rem',
      transition: 'all 0.2s',
      padding: '0.6rem',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '45px',
      height: '45px'
    },
    phoneButton: {
      color: '#0066cc',
      borderColor: '#0066cc'
    },
    whatsappButton: {
      color: '#25D366',
      borderColor: '#25D366'
    },
    emailButton: {
      color: '#a02d6f',
      borderColor: '#a02d6f'
    }
  };

  return (
    <div 
      style={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.imageContainer} onClick={handleViewDetails}>
        {images.length > 0 ? (
          <>
            <img src={images[currentImageIndex]} alt={pkg.title} style={styles.image} />
            {images.length > 1 && (
              <div style={styles.imageNav}>
                {images.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.dot,
                      ...(index === currentImageIndex ? styles.activeDot : {})
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                  />
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>
      <div style={styles.content}>
        <h3 style={styles.title} onClick={handleViewDetails}>{pkg.title}</h3>
        <div>
          <h4 style={styles.includesTitle}>Includes:</h4>
          <ul style={styles.list}>
            {pkg.includes.map((item, index) => (
              <li key={index} style={styles.listItem}>
                <span style={styles.bullet}>◆</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p style={styles.description}>{pkg.description}</p>
        <button onClick={handleBook} style={styles.bookButton}>
          <FaCalendarAlt /> Book This Package
        </button>
        <div style={styles.contactButtons}>
          <button 
            onClick={handleCall} 
            style={{...styles.iconButton, ...styles.phoneButton}}
            title="Call us"
          >
            <FaPhone />
          </button>
          <button 
            onClick={handleWhatsApp} 
            style={{...styles.iconButton, ...styles.whatsappButton}}
            title="WhatsApp"
          >
            <FaWhatsapp />
          </button>
          <button 
            onClick={handleEmail} 
            style={{...styles.iconButton, ...styles.emailButton}}
            title="Email us"
          >
            <FaEnvelope />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;