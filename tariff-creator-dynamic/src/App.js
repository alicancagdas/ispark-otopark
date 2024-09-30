import React, { useState } from 'react';
import { Container, Navbar, Nav, Tabs, Tab } from 'react-bootstrap';
import { FaBell, FaUser, FaSearch, FaCar, FaMapMarkerAlt, FaMoneyBillWave, FaBox } from 'react-icons/fa';
import Tariff from './components/Tariff';
import VehicleType from './components/VehicleType';
import CustomerType from './components/CustomerType';
import LocationComponent from './components/LocationComponent';
import PackageCreator from './components/PackageCreator';
import UpperPackageCreator from './components/UpperPackageCreator';
import ParkingLotCreator from './components/ParkingLotCreator';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ParkingLot from './components/ParkingLot';
import TariffFinder from './components/TariffFinder';

function App() {
  const [key, setKey] = useState('tariffs');
  const [selectedTariff, setSelectedTariff] = useState(null);

  const switchToNextTab = (nextTabKey) => {
    setKey(nextTabKey);
  };

  return (
    <div className="App min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-lg py-3 fixed-top">
        <Container>
          <Navbar.Brand href="#" className="font-bold text-yellow-500 text-2xl">İSPARK Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarResponsive" />
          <Navbar.Collapse id="navbarResponsive">
            <Nav className="me-auto">
              <Nav.Link href="#home" className="text-white hover:text-yellow-500 transition">Home</Nav.Link>
              <Nav.Link href="#dashboard" className="text-white hover:text-yellow-500 transition">Dashboard</Nav.Link>
            </Nav>
            <Nav className="ms-auto d-flex align-items-center">
              <Nav.Item className="me-4">
                <FaSearch className="text-white hover:text-yellow-500 transition text-lg cursor-pointer" />
              </Nav.Item>
              <Nav.Item className="me-4">
                <FaBell className="text-white hover:text-yellow-500 transition text-lg cursor-pointer" />
              </Nav.Item>
              <Nav.Item className="me-4">
                <FaUser className="text-white hover:text-yellow-500 transition text-lg cursor-pointer" />
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Tabs Section */}
      <Container className="mt-5 pt-5">
        <Tabs
          id="dashboard-tabs"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-5 border-b-2 border-yellow-500"
          justify
          transition
        >
          <Tab
            eventKey="tariffs"
            title={
              <span className="flex items-center text-dark hover:text-yellow-500 transition">
                <FaMoneyBillWave className="mr-2" /> Tariffs
              </span>
            }
          >
            <div className="p-4 bg-white shadow-lg rounded-lg">
              <Tariff selectedTariff={selectedTariff} />
            </div>
          </Tab>

          <Tab
            eventKey="vehicle-types"
            title={
              <span className="flex items-center text-dark hover:text-yellow-500 transition">
                <FaCar className="mr-2" /> Vehicle Types
              </span>
            }
          >
            <div className="p-4 bg-white shadow-lg rounded-lg">
              <VehicleType />
            </div>
          </Tab>

          <Tab
            eventKey="customer-types"
            title={
              <span className="flex items-center text-dark hover:text-yellow-500 transition">
                <FaUser className="mr-2" /> Customer Types
              </span>
            }
          >
            <div className="p-4 bg-white shadow-lg rounded-lg">
              <CustomerType />
            </div>
          </Tab>

          <Tab
            eventKey="location-management"
            title={
              <span className="flex items-center text-dark hover:text-yellow-500 transition">
                <FaMapMarkerAlt className="mr-2" /> Location Management
              </span>
            }
          >
            <div className="p-4 bg-white shadow-lg rounded-lg">
              <LocationComponent />
            </div>
          </Tab>
          
  

          <Tab
            eventKey="package-creator"
            title={
              <span className="flex items-center text-dark hover:text-yellow-500 transition">
                <FaBox className="mr-2" /> Package Creator
              </span>
            }
          >
            <div className="p-4 bg-white shadow-lg rounded-lg">
              <PackageCreator switchToNextTab={switchToNextTab} />
            </div>
          </Tab>

          <Tab
            eventKey="upper-package-creator"
            title={
              <span className="flex items-center text-dark hover:text-yellow-500 transition">
                <FaBox className="mr-2" /> Upper Package Creator
              </span>
            }
          >
            <div className="p-4 bg-white shadow-lg rounded-lg">
              <UpperPackageCreator />
            </div>
          </Tab>
          <Tab
            eventKey="parking-lot-creator"
            title={
              <span className="flex items-center text-dark hover:text-yellow-500 transition">
                <FaBox className="mr-2" /> Parking Lot Management
              </span>
            }
          >
            <div className="p-4 bg-white shadow-lg rounded-lg">
              <ParkingLotCreator switchToNextTab={switchToNextTab} />
            </div>
          </Tab>
          <Tab
            eventKey="tariff-finder"
            title={
              <span className="flex items-center text-dark hover:text-yellow-500 transition">
                <FaMapMarkerAlt className="mr-2" /> Tariff Finder
              </span>
            }
          >
            <div className="p-4 bg-white shadow-lg rounded-lg">
              <TariffFinder />
            </div>
          </Tab>

         
        </Tabs>
      </Container>
    </div>
  );
}

export default App;
