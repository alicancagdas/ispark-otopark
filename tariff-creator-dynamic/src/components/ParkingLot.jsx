import React, { useState, useEffect } from 'react';
import { Button, Form, Card, Modal, Accordion, Spinner, Alert } from 'react-bootstrap';

function ParkingLot() {
  const [parkingLots, setParkingLots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingParkingLot, setEditingParkingLot] = useState(null);
  const [newParkingLot, setNewParkingLot] = useState({
    parkingLotNo: '',
    name: '',
    capacity: 0,
    availableSpaces: 0,
    numberOfEmployees: 0,
    numberOfEntrances: 0,
    entranceNumbers: [],
    parkingLotType: '',
    cityCode: '',
    districtCode: '',
    streetCode: '',
    address: '',
    upperPackageIds: [],
    operatingHours: '',
    active: true,
    contactNumber: '',
    email: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Otoparkları bileşen yüklendiğinde getir
  useEffect(() => {
    fetchParkingLots();
  }, []);

  // API'den otoparkları getir
  const fetchParkingLots = () => {
    setLoading(true);
    fetch('http://localhost:8080/api/parking-lots')
      .then((response) => response.json())
      .then((data) => {
        setParkingLots(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Otoparklar getirilirken hata oluştu:', error);
        setErrorMessage('Otoparklar getirilirken hata oluştu.');
        setLoading(false);
      });
  };

  // Silme işlemi
  const handleDelete = (parkingLotNo) => {
    fetch(`http://localhost:8080/api/parking-lots/${parkingLotNo}`, {
      method: 'DELETE',
    })
      .then(() => fetchParkingLots()) // Silme işleminden sonra otoparkları yenile
      .catch((error) => console.error('Otopark silinirken hata oluştu:', error));
  };

  // Form gönderimi (oluşturma veya güncelleme)
  const handleSubmit = (e) => {
    e.preventDefault();

    const url = editingParkingLot
      ? `http://localhost:8080/api/parking-lots/${editingParkingLot.parkingLotNo}`
      : 'http://localhost:8080/api/parking-lots';

    const method = editingParkingLot ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newParkingLot),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('İstek başarısız oldu');
        }
        return response.json();
      })
      .then(() => {
        fetchParkingLots();
        handleCloseModal(); // Modalı kapat ve formu sıfırla
      })
      .catch((error) => {
        console.error('Otopark gönderilirken hata oluştu:', error);
        setErrorMessage('Otopark gönderilirken hata oluştu. Lütfen tüm alanları doğru doldurduğunuzdan emin olun.');
      });
  };

  // Düzenleme butonuna tıklandığında
  const handleEdit = (parkingLot) => {
    setEditingParkingLot(parkingLot);
    setNewParkingLot({ ...parkingLot });
    setShowModal(true);
  };

  // Modalı kapat ve formu sıfırla
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingParkingLot(null);
    setNewParkingLot({
      parkingLotNo: '',
      name: '',
      capacity: 0,
      availableSpaces: 0,
      numberOfEmployees: 0,
      numberOfEntrances: 0,
      entranceNumbers: [],
      parkingLotType: '',
      cityCode: '',
      districtCode: '',
      streetCode: '',
      address: '',
      upperPackageIds: [],
      operatingHours: '',
      active: true,
      contactNumber: '',
      email: '',
      description: '',
    });
    setErrorMessage('');
  };

  // Çoklu giriş (array) alanları için yardımcı fonksiyonlar
  const handleArrayChange = (e, fieldName) => {
    const values = e.target.value.split(',').map((item) => item.trim());
    setNewParkingLot({ ...newParkingLot, [fieldName]: values });
  };

  return (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h4>Otoparklar</h4>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Yeni Otopark Ekle
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <Spinner animation="border" />
        ) : errorMessage ? (
          <Alert variant="danger">{errorMessage}</Alert>
        ) : (
          <Accordion>
            {parkingLots.map((parkingLot, index) => (
              <Accordion.Item eventKey={index.toString()} key={index}>
                <Accordion.Header>
                  {parkingLot.parkingLotNo} - {parkingLot.name}
                </Accordion.Header>
                <Accordion.Body>
                  <p><strong>Kapasite:</strong> {parkingLot.capacity}</p>
                  <p><strong>Mevcut Boş Yer:</strong> {parkingLot.availableSpaces}</p>
                  <p><strong>Çalışan Sayısı:</strong> {parkingLot.numberOfEmployees}</p>
                  <p><strong>Giriş Sayısı:</strong> {parkingLot.numberOfEntrances}</p>
                  <p><strong>Giriş Numaraları:</strong> {parkingLot.entranceNumbers.join(', ')}</p>
                  <p><strong>Otopark Türü:</strong> {parkingLot.parkingLotType}</p>
                  <p><strong>Adres:</strong> {parkingLot.address}</p>
                  <p><strong>İşletim Saatleri:</strong> {parkingLot.operatingHours}</p>
                  <p><strong>Aktif mi?</strong> {parkingLot.active ? 'Evet' : 'Hayır'}</p>
                  <p><strong>İletişim Numarası:</strong> {parkingLot.contactNumber}</p>
                  <p><strong>E-posta:</strong> {parkingLot.email}</p>
                  <p><strong>Açıklama:</strong> {parkingLot.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <Button variant="warning" className="me-2" onClick={() => handleEdit(parkingLot)}>
                      Düzenle
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(parkingLot.parkingLotNo)}>
                      Sil
                    </Button>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        )}
      </Card.Body>

      {/* Otopark Ekleme/Düzenleme Modali */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingParkingLot ? 'Otoparkı Düzenle' : 'Yeni Otopark Ekle'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="parkingLotNo">
              <Form.Label>Otopark Numarası</Form.Label>
              <Form.Control
                type="text"
                value={newParkingLot.parkingLotNo}
                onChange={(e) => setNewParkingLot({ ...newParkingLot, parkingLotNo: e.target.value })}
                required
                disabled={!!editingParkingLot} // Düzenlerken devre dışı bırak
              />
            </Form.Group>

            <Form.Group controlId="name" className="mt-3">
              <Form.Label>Otopark Adı</Form.Label>
              <Form.Control
                type="text"
                value={newParkingLot.name}
                onChange={(e) => setNewParkingLot({ ...newParkingLot, name: e.target.value })}
                required
              />
            </Form.Group>

            {/* Diğer alanlar */}
            <Form.Group controlId="capacity" className="mt-3">
              <Form.Label>Kapasite</Form.Label>
              <Form.Control
                type="number"
                value={newParkingLot.capacity}
                onChange={(e) => setNewParkingLot({ ...newParkingLot, capacity: parseInt(e.target.value) })}
                required
              />
            </Form.Group>

            <Form.Group controlId="availableSpaces" className="mt-3">
              <Form.Label>Mevcut Boş Yer</Form.Label>
              <Form.Control
                type="number"
                value={newParkingLot.availableSpaces}
                onChange={(e) => setNewParkingLot({ ...newParkingLot, availableSpaces: parseInt(e.target.value) })}
                required
              />
            </Form.Group>

            <Form.Group controlId="numberOfEmployees" className="mt-3">
              <Form.Label>Çalışan Sayısı</Form.Label>
              <Form.Control
                type="number"
                value={newParkingLot.numberOfEmployees}
                onChange={(e) => setNewParkingLot({ ...newParkingLot, numberOfEmployees: parseInt(e.target.value) })}
              />
            </Form.Group>

            <Form.Group controlId="numberOfEntrances" className="mt-3">
              <Form.Label>Giriş Sayısı</Form.Label>
              <Form.Control
                type="number"
                value={newParkingLot.numberOfEntrances}
                onChange={(e) => setNewParkingLot({ ...newParkingLot, numberOfEntrances: parseInt(e.target.value) })}
              />
            </Form.Group>

            <Form.Group controlId="entranceNumbers" className="mt-3">
              <Form.Label>Giriş Numaraları (Virgülle Ayırın)</Form.Label>
              <Form.Control
                type="text"
                value={newParkingLot.entranceNumbers.join(', ')}
                onChange={(e) => handleArrayChange(e, 'entranceNumbers')}
              />
            </Form.Group>

            <Form.Group controlId="parkingLotType" className="mt-3">
              <Form.Label>Otopark Türü</Form.Label>
              <Form.Control
                type="text"
                value={newParkingLot.parkingLotType}
                onChange={(e) => setNewParkingLot({ ...newParkingLot, parkingLotType: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="address" className="mt-3">
              <Form.Label>Adres</Form.Label>
              <Form.Control
                type="text"
                value={newParkingLot.address}
                onChange={(e) => setNewParkingLot({ ...newParkingLot, address: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="operatingHours" className="mt-3">
              <Form.Label>İşletim Saatleri</Form.Label>
              <Form.Control
                type="text"
                value={newParkingLot.operatingHours}
                onChange={(e) => setNewParkingLot({ ...newParkingLot, operatingHours: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="active" className="mt-3">
              <Form.Check
                type="checkbox"
                label="Aktif"
                checked={newParkingLot.active}
                onChange={(e) => setNewParkingLot({ ...newParkingLot, active: e.target.checked })}
              />
            </Form.Group>

            <Form.Group controlId="contactNumber" className="mt-3">
              <Form.Label>İletişim Numarası</Form.Label>
              <Form.Control
                type="text"
                value={newParkingLot.contactNumber}
                onChange={(e) => setNewParkingLot({ ...newParkingLot, contactNumber: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="email" className="mt-3">
              <Form.Label>E-posta</Form.Label>
              <Form.Control
                type="email"
                value={newParkingLot.email}
                onChange={(e) => setNewParkingLot({ ...newParkingLot, email: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="description" className="mt-3">
              <Form.Label>Açıklama</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newParkingLot.description}
                onChange={(e) => setNewParkingLot({ ...newParkingLot, description: e.target.value })}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              {editingParkingLot ? 'Otoparkı Güncelle' : 'Otoparkı Kaydet'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Card>
  );
}

export default ParkingLot;
