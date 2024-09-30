import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col, Card, Accordion, Spinner, Alert } from 'react-bootstrap';

function UpperPackageCreator() {
  const [packages, setPackages] = useState([]); // Seçim için tüm mevcut paketler
  const [upperPackages, setUpperPackages] = useState([]); // Mevcut üst paketler
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [upperPackageName, setUpperPackageName] = useState('');
  const [upperPackageDescription, setUpperPackageDescription] = useState('');
  const [upperPackageNo, setUpperPackageNo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [loadingUpperPackages, setLoadingUpperPackages] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Paketleri seçim için getir
  useEffect(() => {
    fetchPackages();
    fetchUpperPackages(); // Mevcut üst paketleri getir
  }, []);

  const fetchPackages = () => {
    fetch('http://localhost:8085/api/parking-packages')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setPackages(data || []); // Veri null değilse ayarla
        setLoadingPackages(false);
      })
      .catch((error) => {
        console.error('Paketler getirilirken hata oluştu:', error);
        setErrorMessage('Paketler getirilirken hata oluştu.');
        setLoadingPackages(false);
      });
  };

  // Mevcut üst paketleri getir
  const fetchUpperPackages = () => {
    fetch('http://localhost:8086/api/upper-packages')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setUpperPackages(data || []); // Veri null değilse ayarla
        setLoadingUpperPackages(false);
      })
      .catch((error) => {
        console.error('Üst paketler getirilirken hata oluştu:', error);
        setErrorMessage('Üst paketler getirilirken hata oluştu.');
        setLoadingUpperPackages(false);
      });
  };

  // Paket seçimi
  const handlePackageSelect = (packageId) => {
    if (selectedPackages.includes(packageId)) {
      setSelectedPackages(selectedPackages.filter((id) => id !== packageId));
    } else {
      setSelectedPackages([...selectedPackages, packageId]);
    }
  };

  // Yeni üst paket oluşturma
  const handleAddUpperPackage = () => {
    if (upperPackageName && upperPackageDescription && upperPackageNo && selectedPackages.length > 0) {
      const subPackageInfos = selectedPackages.map(pkgId => {
        const pkg = packages.find(p => p.id === pkgId);
        return {
          subPackageId: pkg.id,
          subPackageName: pkg.packageName,
          subPackageDescription: pkg.packageDescription,
          subCustomerType: pkg.customerTypeName, // Burada ekledik
        };
      });

      const upperPackageData = {
        upperPackageName,
        upperPackageDescription,
        upperPackageNo,
        upperSubPackages: subPackageInfos,
      };

      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');

      fetch('http://localhost:8086/api/upper-packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(upperPackageData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setUpperPackages([...upperPackages, data]); // Yeni paketi listeye ekle
          setUpperPackageName('');
          setUpperPackageDescription('');
          setUpperPackageNo('');
          setSelectedPackages([]);
          setSuccessMessage('Üst Paket başarıyla oluşturuldu!');
        })
        .catch((error) => {
          setErrorMessage('Üst paket oluşturulurken hata oluştu. Lütfen tekrar deneyin.');
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } else {
      setErrorMessage('Lütfen tüm alanları doldurun ve en az bir paket seçin.');
    }
  };

  return (
    <div>
      <Form>
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Üst Paket Adı</Form.Label>
              <Form.Control
                type="text"
                value={upperPackageName}
                onChange={(e) => setUpperPackageName(e.target.value)}
                placeholder="Üst paket adını girin"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Üst Paket Açıklaması</Form.Label>
              <Form.Control
                type="text"
                value={upperPackageDescription}
                onChange={(e) => setUpperPackageDescription(e.target.value)}
                placeholder="Üst paket açıklamasını girin"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Üst Paket Numarası</Form.Label>
              <Form.Control
                type="text"
                value={upperPackageNo}
                onChange={(e) => setUpperPackageNo(e.target.value)}
                placeholder="Üst paket numarasını girin"
              />
            </Form.Group>
          </Col>
        </Row>

        <h5>Üst Pakete Dahil Edilecek Paketleri Seçin</h5>
        {loadingPackages ? (
          <Spinner animation="border" variant="primary" />
        ) : packages.length > 0 ? (
          <div className="mb-3">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="mb-2">
                <Card.Body>
                  <strong>Paket Numarası: {pkg.id}</strong>
                  <p>{pkg.packageName}</p>
                  <p>{pkg.packageDescription}</p>
                  <p>Müşteri Türü: {pkg.customerTypeName}</p>
                  <Accordion>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>Paket Detayları</Accordion.Header>
                      <Accordion.Body>
                        <ul>
                          {pkg.vehicleTypes?.map((vehicle, i) => (
                            <li key={i}>
                              {vehicle.vehicleTypeName} - Tarifeler: {vehicle.tariffs?.map(t => t.tariffName).join(', ')}
                            </li>
                          ))}
                        </ul>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                  <Form.Check
                    type="checkbox"
                    label="Bu paketi seç"
                    checked={selectedPackages.includes(pkg.id)}
                    onChange={() => handlePackageSelect(pkg.id)}
                  />
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          <p>Paket bulunamadı.</p>
        )}

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <Button
          variant="primary"
          className="w-100 mt-3"
          onClick={handleAddUpperPackage}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Oluşturuluyor...' : 'Üst Paketi Oluştur'}
        </Button>
      </Form>

      {/* Mevcut üst paketleri göster */}
      <h5 className="mt-5">Mevcut Üst Paketler</h5>
      {loadingUpperPackages ? (
        <Spinner animation="border" />
      ) : upperPackages.length > 0 ? (
        <div>
          {upperPackages.map((upperPkg) => (
            <Card key={upperPkg.upperPackageId} className="mb-2">
              <Card.Body>
                <strong>Upper Package ID: {upperPkg.upperPackageId}</strong><br />
                <strong>Upper Package Number: {upperPkg.upperPackageNo}</strong>
                <p>Name: {upperPkg.upperPackageName}</p>
                <p>Description: {upperPkg.upperPackageDescription}</p>
                <Accordion>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Sub Packages</Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        {upperPkg.upperSubPackages?.map((subPkg, i) => (
                          <li key={i}>
                            SubPackage ID: {subPkg.subPackageId}, Name: {subPkg.subPackageName}, Description: {subPkg.subPackageDescription}, Customer Type: {subPkg.subCustomerType}
                          </li>
                        ))}
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <p>Üst paket bulunamadı.</p>
      )}
    </div>
  );
}

export default UpperPackageCreator;
