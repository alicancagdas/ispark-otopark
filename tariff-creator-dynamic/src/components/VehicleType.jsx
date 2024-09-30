import React, { useState, useEffect } from 'react';
import { Button, Form, Card, Modal, Accordion } from 'react-bootstrap';

function VehicleType() {
  const [vehicleTypes, setVehicleTypes] = useState([]); // Başlangıçta boş dizi
  const [showModal, setShowModal] = useState(false);
  const [editingVehicleType, setEditingVehicleType] = useState(null);
  const [newVehicleType, setNewVehicleType] = useState({ typeNo: '', name: '' });

  // Bileşen yüklendiğinde araç tiplerini API'den çek
  useEffect(() => {
    fetchVehicleTypes();
  }, []);

  const fetchVehicleTypes = () => {
    fetch('http://localhost:8083/api/vehicle-types')
      .then((response) => response.json())
      .then((data) => {
        setVehicleTypes(data || []); // Veri boşsa boş dizi ata
      })
      .catch((error) => console.error('Error fetching vehicle types:', error));
  };

  const handleDelete = (typeNo) => {
    fetch(`http://localhost:8083/api/vehicle-types/${typeNo}`, {
      method: 'DELETE',
    })
      .then(() => fetchVehicleTypes()) // Silindikten sonra listeyi yeniden getir
      .catch((error) => console.error('Error deleting vehicle type:', error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = editingVehicleType
      ? `http://localhost:8083/api/vehicle-types/${editingVehicleType.typeNo}`
      : 'http://localhost:8083/api/vehicle-types';

    const method = editingVehicleType ? 'PUT' : 'POST';

    const trimmedVehicleType = {
      typeNo: newVehicleType.typeNo.trim(),
      name: newVehicleType.name.trim(),
    };

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trimmedVehicleType),
    })
      .then(() => {
        fetchVehicleTypes(); // Veri başarıyla eklenince listeyi güncelle
        handleCloseModal();  // Modali kapat
      })
      .catch((error) => console.error(`Error ${editingVehicleType ? 'updating' : 'creating'} vehicle type:`, error));
  };

  const handleEdit = (vehicleType) => {
    setEditingVehicleType(vehicleType);
    setNewVehicleType({ typeNo: vehicleType.typeNo, name: vehicleType.name });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVehicleType(null); // Düzenleme durumu sıfırlansın
    setNewVehicleType({ typeNo: '', name: '' }); // Formu sıfırla
  };

  return (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h4>Vehicle Types</h4>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Add New Vehicle Type
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Accordion>
          {Array.isArray(vehicleTypes) && vehicleTypes.length > 0 ? (
            vehicleTypes.map((vehicleType, index) => (
              <Accordion.Item eventKey={index.toString()} key={index}>
                <Accordion.Header>
                  {vehicleType.name} ({vehicleType.typeNo})
                </Accordion.Header>
                <Accordion.Body>
                  <div className="d-flex justify-content-between">
                    <Button
                      variant="warning"
                      className="me-2"
                      onClick={() => handleEdit(vehicleType)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(vehicleType.typeNo)}
                    >
                      Delete
                    </Button>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))
          ) : (
            <p>No vehicle types available.</p>
          )}
        </Accordion>
      </Card.Body>

      {/* Modal for Adding/Editing Vehicle Type */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingVehicleType ? 'Edit Vehicle Type' : 'Add New Vehicle Type'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formVehicleTypeNo">
              <Form.Label>Type No</Form.Label>
              <Form.Control
                type="text"
                value={newVehicleType.typeNo}
                onChange={(e) => setNewVehicleType({ ...newVehicleType, typeNo: e.target.value })}
                required
                disabled={!!editingVehicleType}
              />
            </Form.Group>
            <Form.Group controlId="formVehicleTypeName" className="mt-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newVehicleType.name}
                onChange={(e) => setNewVehicleType({ ...newVehicleType, name: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              {editingVehicleType ? 'Update Vehicle Type' : 'Save Vehicle Type'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Card>
  );
}

export default VehicleType;
