import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col, Card, Accordion, Spinner, Alert, Table } from 'react-bootstrap';

function ParkingLotCreator() {
  const [upperPackages, setUpperPackages] = useState([]);
  const [selectedUpperPackages, setSelectedUpperPackages] = useState([]); // Tüm seçilen üst paketler
  const [activeUpperPackageId, setActiveUpperPackageId] = useState(''); // Aktif üst paket
  const [parkingLots, setParkingLots] = useState([]); // Otopark listesi
  const [parkingLotData, setParkingLotData] = useState({
    parkingLotNo: '',
    name: '',
    capacity: '',
    availableSpaces: '',
    numberOfEmployees: '',
    numberOfEntrances: '',
    entranceNumbers: '',
    parkingLotType: '',
    cityCode: '',
    districtCode: '',
    streetCode: '',
    address: '',
    operatingHours: '',
    isActive: true,
    contactNumber: '',
    email: '',
    description: '',
  });
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [streets, setStreets] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingUpperPackages, setLoadingUpperPackages] = useState(true);
  const [loadingParkingLots, setLoadingParkingLots] = useState(true); // Otoparklar için
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const parkingLotTypes = ['UNDERGROUND', 'MULTI_STORY', 'OPEN_AIR', 'VALET'];

  // Component mount olduğunda şehirler, üst paketler ve otopark listesi yüklenir
  useEffect(() => {
    fetchCities();
    fetchUpperPackages();
    fetchParkingLots(); // Otopark listesini al
  }, []);

  const fetchCities = () => {
    fetch('http://localhost:8084/api/cities')
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((error) => console.error('Error fetching cities:', error))
      .finally(() => setLoadingCities(false));
  };

  const fetchDistricts = (cityCode) => {
    fetch(`http://localhost:8084/api/districts/city/${cityCode}`)
      .then((response) => response.json())
      .then((data) => setDistricts(data))
      .catch((error) => console.error('Error fetching districts:', error));
  };

  const fetchStreets = (districtCode, cityCode) => {
    fetch(`http://localhost:8084/api/streets/district/${districtCode}/city/${cityCode}`)
      .then((response) => response.json())
      .then((data) => setStreets(data))
      .catch((error) => console.error('Error fetching streets:', error));
  };

  const fetchUpperPackages = () => {
    fetch('http://localhost:8086/api/upper-packages')
      .then((response) => response.json())
      .then((data) => setUpperPackages(data))
      .catch((error) => console.error('Error fetching upper packages:', error))
      .finally(() => setLoadingUpperPackages(false));
  };

  const fetchParkingLots = () => {
    fetch('http://localhost:8087/api/parking-lots')
      .then((response) => response.json())
      .then((data) => setParkingLots(data)) // Otopark listesini sakla
      .catch((error) => console.error('Error fetching parking lots:', error))
      .finally(() => setLoadingParkingLots(false));
  };

  const handleCityChange = (e) => {
    const cityCode = e.target.value;
    setParkingLotData((prevData) => ({ ...prevData, cityCode }));
    setDistricts([]);
    setStreets([]);
    fetchDistricts(cityCode);
  };

  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    setParkingLotData((prevData) => ({ ...prevData, districtCode }));
    setStreets([]);
    fetchStreets(districtCode, parkingLotData.cityCode);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setParkingLotData({
      ...parkingLotData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleUpperPackageSelect = (upperPackageId) => {
    setSelectedUpperPackages((prevSelected) =>
      prevSelected.includes(upperPackageId)
        ? prevSelected.filter((id) => id !== upperPackageId)
        : [...prevSelected, upperPackageId]
    );
  };

  const handleActiveUpperPackageChange = (e) => {
    setActiveUpperPackageId(e.target.value); // Aktif üst paketi güncelle
  };

  const handleAddParkingLot = () => {
    const requiredFields = ['parkingLotNo', 'name', 'parkingLotType', 'address', 'cityCode', 'districtCode', 'streetCode'];
    const isValid = requiredFields.every((field) => parkingLotData[field]);

    if (!isValid) {
      setErrorMessage('Lütfen gerekli tüm alanları doldurun.');
      return;
    }

    const parkingLotToSubmit = {
      ...parkingLotData,
      capacity: parseInt(parkingLotData.capacity) || 0,
      availableSpaces: parseInt(parkingLotData.availableSpaces) || 0,
      numberOfEmployees: parseInt(parkingLotData.numberOfEmployees) || 0,
      numberOfEntrances: parseInt(parkingLotData.numberOfEntrances) || 0,
      entranceNumbers: parkingLotData.entranceNumbers.split(',').map((item) => item.trim()),
      upperPackageIds: selectedUpperPackages,
      activeUpperPackageId: activeUpperPackageId, // Aktif üst paketi ekle
    };

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    fetch('http://localhost:8087/api/parking-lots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parkingLotToSubmit),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        setParkingLotData({
          parkingLotNo: '',
          name: '',
          capacity: '',
          availableSpaces: '',
          numberOfEmployees: '',
          numberOfEntrances: '',
          entranceNumbers: '',
          parkingLotType: '',
          cityCode: '',
          districtCode: '',
          streetCode: '',
          address: '',
          operatingHours: '',
          isActive: true,
          contactNumber: '',
          email: '',
          description: '',
        });
        setSelectedUpperPackages([]);
        setActiveUpperPackageId(''); // Aktif paketi sıfırla
        setSuccessMessage('Otopark başarıyla oluşturuldu!');
        fetchParkingLots(); // Yeni otopark oluşturulduktan sonra listeyi güncelle
      })
      .catch((error) => {
        console.error('Error creating parking lot:', error);
        setErrorMessage('Otopark oluşturulurken hata oluştu. Lütfen tekrar deneyin.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div>
      {/* Form to Create New Parking Lot */}
      <Form>
        {/* Parking Lot No and Name Fields */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Otopark Numarası</Form.Label>
              <Form.Control
                type="text"
                name="parkingLotNo"
                value={parkingLotData.parkingLotNo}
                onChange={handleInputChange}
                placeholder="Otopark numarasını girin"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Otopark Adı</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={parkingLotData.name}
                onChange={handleInputChange}
                placeholder="Otopark adını girin"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Capacity, Available Spaces, Number of Employees */}
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Kapasite</Form.Label>
              <Form.Control
                type="number"
                name="capacity"
                value={parkingLotData.capacity}
                onChange={handleInputChange}
                placeholder="Toplam kapasite"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Mevcut Alan</Form.Label>
              <Form.Control
                type="number"
                name="availableSpaces"
                value={parkingLotData.availableSpaces}
                onChange={handleInputChange}
                placeholder="Mevcut boş alanlar"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Çalışan Sayısı</Form.Label>
              <Form.Control
                type="number"
                name="numberOfEmployees"
                value={parkingLotData.numberOfEmployees}
                onChange={handleInputChange}
                placeholder="Çalışan sayısı"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Number of Entrances and Entrance Numbers */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Giriş Sayısı</Form.Label>
              <Form.Control
                type="number"
                name="numberOfEntrances"
                value={parkingLotData.numberOfEntrances}
                onChange={handleInputChange}
                placeholder="Giriş sayısı"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Giriş Numaraları (Virgülle ayrılmış)</Form.Label>
              <Form.Control
                type="text"
                name="entranceNumbers"
                value={parkingLotData.entranceNumbers}
                onChange={handleInputChange}
                placeholder="Giriş numaralarını girin"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Address Field */}
        <Form.Group className="mb-3">
          <Form.Label>Adres</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={parkingLotData.address}
            onChange={handleInputChange}
            placeholder="Otopark adresini girin"
          />
        </Form.Group>

        {/* Parking Lot Type */}
        <Form.Group className="mb-3">
          <Form.Label>Otopark Türü</Form.Label>
          <Form.Select
            name="parkingLotType"
            value={parkingLotData.parkingLotType}
            onChange={handleInputChange}
          >
            <option value="">Otopark Türü Seçin</option>
            {parkingLotTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* City, District, and Street Fields */}
        <Form.Group className="mb-3">
          <Form.Label>Şehir</Form.Label>
          <Form.Select
            name="cityCode"
            value={parkingLotData.cityCode}
            onChange={handleCityChange}
          >
            <option value="">Şehir Seçin</option>
            {loadingCities ? <option>Loading cities...</option> : cities.map((city) => (
              <option key={city.cityCode} value={city.cityCode}>
                {city.cityName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>İlçe</Form.Label>
          <Form.Select
            name="districtCode"
            value={parkingLotData.districtCode}
            onChange={handleDistrictChange}
            disabled={!parkingLotData.cityCode}
          >
            <option value="">İlçe Seçin</option>
            {districts.map((district) => (
              <option key={district.districtCode} value={district.districtCode}>
                {district.districtName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Sokak</Form.Label>
          <Form.Select
            name="streetCode"
            value={parkingLotData.streetCode}
            onChange={handleInputChange}
            disabled={!parkingLotData.districtCode}
          >
            <option value="">Sokak Seçin</option>
            {streets.map((street) => (
              <option key={street.streetCode} value={street.streetCode}>
                {street.streetName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Upper Package Selection */}
        <h5>Upper Package Seçimi</h5>
        {loadingUpperPackages ? (
          <Spinner animation="border" variant="primary" />
        ) : upperPackages.length > 0 ? (
          <div className="mb-3">
            {upperPackages.map((upperPkg) => (
              <Card key={upperPkg.upperPackageId} className="mb-2">
                <Card.Body>
                  <strong>Upper Package No: {upperPkg.upperPackageNo}</strong>
                  <p>{upperPkg.upperPackageName}</p>
                  <p>{upperPkg.upperPackageDescription}</p>
                  <Accordion>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>Alt Paketler</Accordion.Header>
                      <Accordion.Body>
                        <ul>
                          {upperPkg.upperSubPackages?.map((subPkg, i) => (
                            <li key={i}>
                              {subPkg.subPackageName} - {subPkg.subPackageDescription}
                            </li>
                          ))}
                        </ul>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                  <Form.Check
                    type="checkbox"
                    label="Bu upper package'i seç"
                    checked={selectedUpperPackages.includes(upperPkg.upperPackageId)}
                    onChange={() => handleUpperPackageSelect(upperPkg.upperPackageId)}
                  />
                </Card.Body>
              </Card>
            ))}

            {/* Aktif Upper Package Seçimi */}
            <Form.Group className="mt-3">
              <Form.Label>Aktif Upper Package Seçin</Form.Label>
              <Form.Select value={activeUpperPackageId} onChange={handleActiveUpperPackageChange}>
                <option value="">Aktif Paket Seçin</option>
                {selectedUpperPackages.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>
        ) : (
          <p>Upper package bulunamadı.</p>
        )}

        {/* Error and Success Messages */}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        {/* Submit Button */}
        <Button
          variant="primary"
          className="w-100 mt-3"
          onClick={handleAddParkingLot}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Oluşturuluyor...' : 'Otoparkı Oluştur'}
        </Button>
      </Form>

      {/* List of Parking Lots */}
      <h3 className="mt-5">Otopark Listesi</h3>
      {loadingParkingLots ? (
        <Spinner animation="border" variant="primary" />
      ) : parkingLots.length > 0 ? (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>No</th>
              <th>Adı</th>
              <th>Kapasite</th>
              <th>Mevcut Alan</th>
              <th>Adres</th>
              <th>Çalışma Saatleri</th>
              <th>Upper Packages</th>
              <th>Aktif Paket</th>
            </tr>
          </thead>
          <tbody>
            {parkingLots.map((lot, index) => (
              <tr key={index}>
                <td>{lot.parkingLotNo}</td>
                <td>{lot.name}</td>
                <td>{lot.capacity}</td>
                <td>{lot.availableSpaces}</td>
                <td>{lot.address}</td>
                <td>{lot.operatingHours}</td>
                <td>
                  {lot.upperPackageIds?.length > 0 ? (
                    <ul>
                      {lot.upperPackageIds.map((id, i) => (
                        <li key={i}>{id}</li>
                      ))}
                    </ul>
                  ) : (
                    'No upper packages selected'
                  )}
                </td>
                <td>{lot.activeUpperPackageId || 'Aktif paket yok'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>Otopark bulunamadı.</p>
      )}
    </div>
  );
}

export default ParkingLotCreator;
