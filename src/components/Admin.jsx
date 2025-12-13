import React, { useState, useEffect } from 'react';

const Admin = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [editingPackage, setEditingPackage] = useState(null);

  // Simple password check (in production, use proper authentication)
  const ADMIN_PASSWORD = 'walker2024';

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = () => {
    const savedServices = localStorage.getItem('walkerServices');
    const savedPackages = localStorage.getItem('walkerPackages');
    
    if (savedServices) setServices(JSON.parse(savedServices));
    if (savedPackages) setPackages(JSON.parse(savedPackages));
  };

  const saveServices = (newServices) => {
    localStorage.setItem('walkerServices', JSON.stringify(newServices));
    setServices(newServices);
  };

  const savePackages = (newPackages) => {
    localStorage.setItem('walkerPackages', JSON.stringify(newPackages));
    setPackages(newPackages);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleServiceSave = (service) => {
    const newServices = editingService.isNew 
      ? [...services, { ...service, id: Date.now() }]
      : services.map(s => s.id === service.id ? service : s);
    saveServices(newServices);
    setEditingService(null);
  };

  const handlePackageSave = (pkg) => {
    const newPackages = editingPackage.isNew
      ? [...packages, { ...pkg, id: Date.now() }]
      : packages.map(p => p.id === pkg.id ? pkg : p);
    savePackages(newPackages);
    setEditingPackage(null);
  };

  const handleServiceDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      saveServices(services.filter(s => s.id !== id));
    }
  };

  const handlePackageDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      savePackages(packages.filter(p => p.id !== id));
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#f5f5f5',
      padding: '2rem'
    },
    loginBox: {
      maxWidth: '400px',
      margin: '5rem auto',
      background: 'white',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    input: {
      width: '100%',
      padding: '0.8rem',
      marginBottom: '1rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '1rem'
    },
    button: {
      width: '100%',
      padding: '0.8rem',
      background: '#0066cc',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      cursor: 'pointer',
      fontWeight: '600'
    },
    header: {
      maxWidth: '1200px',
      margin: '0 auto 2rem',
      textAlign: 'center'
    },
    section: {
      maxWidth: '1200px',
      margin: '0 auto 2rem',
      background: 'white',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    grid: {
      display: 'grid',
      gap: '1rem',
      marginTop: '1rem'
    },
    item: {
      padding: '1rem',
      background: '#f9f9f9',
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    buttonGroup: {
      display: 'flex',
      gap: '0.5rem'
    },
    editButton: {
      padding: '0.5rem 1rem',
      background: '#0066cc',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer'
    },
    deleteButton: {
      padding: '0.5rem 1rem',
      background: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer'
    },
    addButton: {
      padding: '0.8rem 1.5rem',
      background: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600'
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <form style={styles.loginBox} onSubmit={handleLogin}>
          <h2 style={{ marginBottom: '1.5rem', color: '#003d7a' }}>Admin Login</h2>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={{ color: '#003d7a', marginBottom: '0.5rem' }}>Walker Cleaners Admin</h1>
        <button 
          onClick={() => setIsAuthenticated(false)} 
          style={{...styles.button, width: 'auto', padding: '0.5rem 1.5rem'}}
        >
          Logout
        </button>
      </div>

      <div style={styles.section}>
        <h2 style={{ color: '#003d7a', marginBottom: '1rem' }}>Services</h2>
        <button 
          onClick={() => setEditingService({ isNew: true, title: '', icon: '', description: '', images: [] })}
          style={styles.addButton}
        >
          Add New Service
        </button>
        <div style={styles.grid}>
          {services.map(service => (
            <div key={service.id} style={styles.item}>
              <div>
                <strong>{service.icon} {service.title}</strong>
                <p style={{ margin: '0.5rem 0 0', color: '#666' }}>{service.description}</p>
                {service.images && service.images.length > 0 && (
                  <small style={{ color: '#0066cc' }}>{service.images.length} image(s)</small>
                )}
              </div>
              <div style={styles.buttonGroup}>
                <button onClick={() => setEditingService(service)} style={styles.editButton}>Edit</button>
                <button onClick={() => handleServiceDelete(service.id)} style={styles.deleteButton}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={{ color: '#003d7a', marginBottom: '1rem' }}>Packages</h2>
        <button 
          onClick={() => setEditingPackage({ isNew: true, title: '', includes: [], description: '', images: [] })}
          style={styles.addButton}
        >
          Add New Package
        </button>
        <div style={styles.grid}>
          {packages.map(pkg => (
            <div key={pkg.id} style={styles.item}>
              <div>
                <strong>{pkg.title}</strong>
                <p style={{ margin: '0.5rem 0 0', color: '#666' }}>{pkg.description}</p>
                {pkg.images && pkg.images.length > 0 && (
                  <small style={{ color: '#0066cc' }}>{pkg.images.length} image(s)</small>
                )}
              </div>
              <div style={styles.buttonGroup}>
                <button onClick={() => setEditingPackage(pkg)} style={styles.editButton}>Edit</button>
                <button onClick={() => handlePackageDelete(pkg.id)} style={styles.deleteButton}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingService && (
        <ServiceEditor 
          service={editingService} 
          onSave={handleServiceSave}
          onCancel={() => setEditingService(null)}
        />
      )}

      {editingPackage && (
        <PackageEditor 
          package={editingPackage}
          onSave={handlePackageSave}
          onCancel={() => setEditingPackage(null)}
        />
      )}
    </div>
  );
};

const ServiceEditor = ({ service, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    ...service,
    images: service.images || []
  });
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, newImageUrl.trim()]
      });
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const styles = {
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      overflowY: 'auto',
      padding: '2rem 0'
    },
    form: {
      background: 'white',
      padding: '2rem',
      borderRadius: '12px',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '90vh',
      overflowY: 'auto'
    },
    input: {
      width: '100%',
      padding: '0.8rem',
      marginBottom: '1rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '1rem',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: '0.8rem',
      marginBottom: '1rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '1rem',
      minHeight: '100px',
      fontFamily: 'inherit',
      boxSizing: 'border-box'
    },
    imageSection: {
      marginBottom: '1.5rem',
      padding: '1rem',
      background: '#f8f9fa',
      borderRadius: '8px'
    },
    imageInputGroup: {
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '1rem'
    },
    imageInput: {
      flex: 1,
      padding: '0.8rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '1rem'
    },
    addImageButton: {
      padding: '0.8rem 1.5rem',
      background: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      whiteSpace: 'nowrap'
    },
    imageList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '1rem'
    },
    imageItem: {
      position: 'relative',
      paddingTop: '100%',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    image: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    removeImageButton: {
      position: 'absolute',
      top: '5px',
      right: '5px',
      background: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '25px',
      height: '25px',
      cursor: 'pointer',
      fontSize: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      lineHeight: '1'
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem'
    },
    saveButton: {
      flex: 1,
      padding: '0.8rem',
      background: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600'
    },
    cancelButton: {
      flex: 1,
      padding: '0.8rem',
      background: '#6c757d',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600'
    },
    sectionLabel: {
      color: '#003d7a',
      fontWeight: '600',
      marginBottom: '0.5rem',
      display: 'block',
      fontSize: '0.95rem'
    }
  };

  return (
    <div style={styles.modal}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h3 style={{ marginBottom: '1.5rem', color: '#003d7a' }}>
          {service.isNew ? 'Add Service' : 'Edit Service'}
        </h3>
        
        <input
          type="text"
          placeholder="Service Title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          style={styles.input}
          required
        />
        
        <input
          type="text"
          placeholder="Icon (emoji)"
          value={formData.icon}
          onChange={(e) => setFormData({...formData, icon: e.target.value})}
          style={styles.input}
          required
        />
        
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          style={styles.textarea}
          required
        />

        <div style={styles.imageSection}>
          <label style={styles.sectionLabel}>Service Images (Optional)</label>
          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
            Add image URLs - they will appear as slides on the service card
          </p>
          <div style={styles.imageInputGroup}>
            <input
              type="url"
              placeholder="Image URL (e.g., https://example.com/image.jpg)"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              style={styles.imageInput}
            />
            <button type="button" onClick={handleAddImage} style={styles.addImageButton}>
              Add
            </button>
          </div>
          
          {formData.images.length > 0 && (
            <div style={styles.imageList}>
              {formData.images.map((url, index) => (
                <div key={index} style={styles.imageItem}>
                  <img src={url} alt={`Service ${index + 1}`} style={styles.image} />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    style={styles.removeImageButton}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.saveButton}>Save Service</button>
          <button type="button" onClick={onCancel} style={styles.cancelButton}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

const PackageEditor = ({ package: pkg, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    ...pkg,
    includes: pkg.includes ? pkg.includes.join('\n') : '',
    images: pkg.images || []
  });
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      includes: formData.includes.split('\n').filter(line => line.trim())
    });
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, newImageUrl.trim()]
      });
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const styles = {
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      overflowY: 'auto',
      padding: '2rem 0'
    },
    form: {
      background: 'white',
      padding: '2rem',
      borderRadius: '12px',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '90vh',
      overflowY: 'auto'
    },
    input: {
      width: '100%',
      padding: '0.8rem',
      marginBottom: '1rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '1rem',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: '0.8rem',
      marginBottom: '1rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '1rem',
      minHeight: '100px',
      fontFamily: 'inherit',
      boxSizing: 'border-box'
    },
    imageSection: {
      marginBottom: '1.5rem',
      padding: '1rem',
      background: '#f8f9fa',
      borderRadius: '8px'
    },
    imageInputGroup: {
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '1rem'
    },
    imageInput: {
      flex: 1,
      padding: '0.8rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '1rem'
    },
    addImageButton: {
      padding: '0.8rem 1.5rem',
      background: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      whiteSpace: 'nowrap'
    },
    imageList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '1rem'
    },
    imageItem: {
      position: 'relative',
      paddingTop: '100%',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    image: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    removeImageButton: {
      position: 'absolute',
      top: '5px',
      right: '5px',
      background: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '25px',
      height: '25px',
      cursor: 'pointer',
      fontSize: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      lineHeight: '1'
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem'
    },
    saveButton: {
      flex: 1,
      padding: '0.8rem',
      background: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600'
    },
    cancelButton: {
      flex: 1,
      padding: '0.8rem',
      background: '#6c757d',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600'
    },
    sectionLabel: {
      color: '#003d7a',
      fontWeight: '600',
      marginBottom: '0.5rem',
      display: 'block',
      fontSize: '0.95rem'
    }
  };

  return (
    <div style={styles.modal}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h3 style={{ marginBottom: '1.5rem', color: '#003d7a' }}>
          {pkg.isNew ? 'Add Package' : 'Edit Package'}
        </h3>
        
        <input
          type="text"
          placeholder="Package Title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          style={styles.input}
          required
        />
        
        <textarea
          placeholder="Includes (one per line)"
          value={formData.includes}
          onChange={(e) => setFormData({...formData, includes: e.target.value})}
          style={styles.textarea}
          required
        />
        
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          style={styles.textarea}
          required
        />

        <div style={styles.imageSection}>
          <label style={styles.sectionLabel}>Package Images (Optional)</label>
          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
            Add image URLs - they will appear as slides on the package card
          </p>
          <div style={styles.imageInputGroup}>
            <input
              type="url"
              placeholder="Image URL (e.g., https://example.com/image.jpg)"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              style={styles.imageInput}
            />
            <button type="button" onClick={handleAddImage} style={styles.addImageButton}>
              Add
            </button>
          </div>
          
          {formData.images.length > 0 && (
            <div style={styles.imageList}>
              {formData.images.map((url, index) => (
                <div key={index} style={styles.imageItem}>
                  <img src={url} alt={`Package ${index + 1}`} style={styles.image} />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    style={styles.removeImageButton}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.saveButton}>Save Package</button>
          <button type="button" onClick={onCancel} style={styles.cancelButton}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default Admin;