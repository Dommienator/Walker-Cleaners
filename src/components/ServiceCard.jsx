import React, { useState } from 'react';
import { FaPhone, FaWhatsapp, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ service }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const handleCall = () => {
    window.location.href = 'tel:+254768323230';
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi, I'd like to enquire about ${service.title}`);
    window.open(`https://wa.me/254768323230?text=${message}`, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Enquiry about ${service.title}`);
    const body = encodeURIComponent(`Hi,\n\nI'd like to enquire about ${service.title}.\n\nThank you.`);
    window.location.href = `mailto:walkercleanersltd@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleBook = () => {
    navigate(`/book?type=service&id=${service.id}&name=${encodeURIComponent(service.title)}`);
  };

  const handleViewDetails = () => {
    navigate(`/service/${service.id}`);
  };

  const images = service.images || [];

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
      height: '200px',
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
    icon: {
      fontSize: '4rem',
      color: 'white'
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
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      flexGrow: 1
    },
    title: {
      color: '#003d7a',
      fontSize: '1.5rem',
      textAlign: 'center',
      margin: 0
    },
    description: {
      color: '#555',
      lineHeight: '1.6',
      flexGrow: 1
    },
    contactButtons: {
      display: 'flex',
      gap: '0.5rem',
      justifyContent: 'center',
      flexWrap: 'wrap'
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
      justifyContent: 'center',
      width: '100%'
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
            <img src={images[currentImageIndex]} alt={service.title} style={styles.image} />
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
        ) : (
          <div style={styles.icon}>{service.icon}</div>
        )}
      </div>
      <div style={styles.content}>
        <h3 style={styles.title} onClick={handleViewDetails}>{service.title}</h3>
        <p style={styles.description}>{service.description}</p>
        <button onClick={handleBook} style={styles.bookButton}>
          <FaCalendarAlt /> Book This Service
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

export default ServiceCard;