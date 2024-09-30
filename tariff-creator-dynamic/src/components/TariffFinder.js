import React, { useState, useEffect } from 'react';
import { Button, Form, Dropdown, Spinner, Alert } from 'react-bootstrap';

function TariffFinder() {
  const [parkingLots, setParkingLots] = useState([]);
  const [selectedParkingLot, setSelectedParkingLot] = useState('');
  const [customerTypes, setCustomerTypes] = useState(['Standart', 'Disabled']);
  const [selectedCustomerType, setSelectedCustomerType] = useState('');
  const [vehicleTypes, setVehicleTypes] = useState(['Car', 'Bus', 'Motorcycle']);
  const [selectedVehicleType, setSelectedVehicleType] = useState('');
  const [activeTariff, setActiveTariff] = useState('');
  const [tariffDetails, setTariffDetails] = useState(null);  // To store fetched tariff details
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchParkingLots();
  }, []);

  const fetchParkingLots = async () => {
    try {
      const response = await fetch('http://localhost:8087/api/parking-lots');
      const data = await response.json();
      setParkingLots(data);
    } catch (error) {
      console.error('Error fetching parking lots:', error);
    }
  };

  const handleFindTariff = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    setTariffDetails(null);  // Clear previous tariff details

    try {
      // Step 1: Get Active Upper Package ID
      const upperPackageResponse = await fetch(
        `http://localhost:8087/api/parking-lots/${selectedParkingLot}/active-package`
      );
      const upperPackageId = await upperPackageResponse.text();

      // Step 2: Get SubPackage ID
      const subPackageResponse = await fetch(
        `http://localhost:8086/api/upper-packages/by-upperpackage-and-customer-type?upperPackageId=${upperPackageId}&subCustomerType=${selectedCustomerType}`
      );
      const subPackageId = await subPackageResponse.text();

      // Step 3: Get Active Tariff (tarifeNo)
      const tariffResponse = await fetch(
        `http://localhost:8085/api/parking-packages/packages/${subPackageId}/vehicle-types/${selectedVehicleType}/active-tariff`
      );
      const tariffNo = await tariffResponse.text();

      setActiveTariff(tariffNo);
      setSuccessMessage(`Tariff found: ${tariffNo}`);

      // Step 4: Fetch Tariff Details
      const tariffDetailsResponse = await fetch(
        `http://localhost:8080/api/tariffs/tarifeNo/${tariffNo}`
      );
      const tariffDetailsData = await tariffDetailsResponse.json();
      setTariffDetails(tariffDetailsData);

    } catch (error) {
      setErrorMessage('Error finding the tariff.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Find Active Tariff</h2>
      <Form>
        {/* Parking Lot Dropdown */}
        <Form.Group>
          <Form.Label>Select Parking Lot</Form.Label>
          <Dropdown onSelect={(key) => setSelectedParkingLot(key)}>
            <Dropdown.Toggle variant="light" className="w-100">
              {selectedParkingLot || 'Select Parking Lot'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {parkingLots.map((lot) => (
                <Dropdown.Item key={lot.id} eventKey={lot.parkingLotNo}>
                  {lot.parkingLotNo} - {lot.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>

        {/* Customer Type Dropdown */}
        <Form.Group>
          <Form.Label>Select Customer Type</Form.Label>
          <Dropdown onSelect={(key) => setSelectedCustomerType(key)}>
            <Dropdown.Toggle variant="light" className="w-100">
              {selectedCustomerType || 'Select Customer Type'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {customerTypes.map((type) => (
                <Dropdown.Item key={type} eventKey={type}>
                  {type}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>

        {/* Vehicle Type Dropdown */}
        <Form.Group>
          <Form.Label>Select Vehicle Type</Form.Label>
          <Dropdown onSelect={(key) => setSelectedVehicleType(key)}>
            <Dropdown.Toggle variant="light" className="w-100">
              {selectedVehicleType || 'Select Vehicle Type'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {vehicleTypes.map((type) => (
                <Dropdown.Item key={type} eventKey={type}>
                  {type}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>

        <Button
          variant="primary"
          className="w-100 mt-3"
          onClick={handleFindTariff}
          disabled={loading || !selectedParkingLot || !selectedCustomerType || !selectedVehicleType}
        >
          {loading ? <Spinner animation="border" /> : 'Find Active Tariff'}
        </Button>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        {activeTariff && (
          <div>
            <h3>Active Tariff: {activeTariff}</h3>
            {tariffDetails ? (
              <div>
                <h4>{tariffDetails.name}</h4>
                <ul>
                  {tariffDetails.details.map((detail) => (
                    <li key={detail.id}>
                      {`Time: ${detail.startTime} - ${detail.endTime}, Price: ${detail.price}`}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <Spinner animation="border" />
            )}
          </div>
        )}
      </Form>
    </div>
  );
}

export default TariffFinder;
