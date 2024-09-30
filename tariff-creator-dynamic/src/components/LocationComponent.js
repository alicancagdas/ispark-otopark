import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { FaCity, FaMapMarkedAlt, FaRoad } from 'react-icons/fa'; // Icons for tabs
import CityComponent from './CityComponent';
import DistrictComponent from './DistrictComponent';
import StreetComponent from './StreetComponent';

function LocationComponent() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSelectedDistrict(null);
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8">
      <div className="container mx-auto">
        {/* Tabs Section */}
        <div className="bg-white rounded-lg shadow-lg p-5">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-5">Select Your Location</h2>
          <Tabs
            defaultActiveKey="city"
            id="location-tabs"
            className="mb-3 border-b-2 border-gray-200"
            transition={false}
          >
            {/* City Tab */}
            <Tab
              eventKey="city"
              title={
                <span className="flex items-center">
                  <FaCity className="mr-2" />
                  <span>City</span>
                </span>
              }
            >
              <div className="p-5">
                <CityComponent onCitySelect={handleCitySelect} />
              </div>
            </Tab>

            {/* District Tab (Disabled if no city selected) */}
            <Tab
              eventKey="district"
              title={
                <span className={`flex items-center ${!selectedCity ? 'text-gray-400' : ''}`}>
                  <FaMapMarkedAlt className="mr-2" />
                  <span>District</span>
                </span>
              }
              disabled={!selectedCity}
            >
              <div className="p-5">
                <DistrictComponent
                  selectedCity={selectedCity}
                  onDistrictSelect={handleDistrictSelect}
                />
              </div>
            </Tab>

            {/* Street Tab (Disabled if no district selected) */}
            <Tab
              eventKey="street"
              title={
                <span className={`flex items-center ${!selectedDistrict ? 'text-gray-400' : ''}`}>
                  <FaRoad className="mr-2" />
                  <span>Street</span>
                </span>
              }
              disabled={!selectedDistrict}
            >
              <div className="p-5">
                <StreetComponent selectedDistrict={selectedDistrict} selectedCity={selectedCity} />
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default LocationComponent;
