import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ServiceCard from './components/ServiceCard';
import PackageCard from './components/PackageCard';
import Footer from './components/Footer';
import Admin from './components/Admin';
import BookingForm from './components/BookingForm';
import ServiceDetail from './components/ServiceDetail';
import PackageDetail from './components/PackageDetail';
import { services as defaultServices } from './data/services';
import { packages as defaultPackages } from './data/packages';

function HomePage() {
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    // Load from localStorage or use defaults
    const savedServices = localStorage.getItem('walkerServices');
    const savedPackages = localStorage.getItem('walkerPackages');
    
    setServices(savedServices ? JSON.parse(savedServices) : defaultServices);
    setPackages(savedPackages ? JSON.parse(savedPackages) : defaultPackages);
    
    // Save defaults if nothing exists
    if (!savedServices) {
      localStorage.setItem('walkerServices', JSON.stringify(defaultServices));
    }
    if (!savedPackages) {
      localStorage.setItem('walkerPackages', JSON.stringify(defaultPackages));
    }
  }, []);

  const styles = {
    app: {
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      background: '#f5f5f5'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 2rem'
    },
    section: {
      padding: '4rem 0'
    },
    packagesSection: {
      padding: '4rem 0',
      background: 'white'
    },
    sectionTitle: {
      fontSize: '2.5rem',
      color: '#003d7a',
      textAlign: 'center',
      marginBottom: '3rem',
      fontWeight: 'bold'
    },
    servicesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem'
    },
    packagesGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '2rem',
      maxWidth: '900px',
      margin: '0 auto'
    }
  };

  return (
    <div style={styles.app}>
      <Header />
      
      <section id="services" style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Our Services</h2>
          <div style={styles.servicesGrid}>
            {services.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section id="packages" style={styles.packagesSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Service Packages</h2>
          <div style={styles.packagesGrid}>
            {packages.map(pkg => (
              <PackageCard key={pkg.id} package={pkg} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/book" element={<BookingForm />} />
        <Route path="/service/:id" element={<ServiceDetail />} />
        <Route path="/package/:id" element={<PackageDetail />} />
      </Routes>
    </Router>
  );
}

export default App;