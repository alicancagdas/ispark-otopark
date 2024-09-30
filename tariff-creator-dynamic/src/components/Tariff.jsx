import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Card, Modal, Accordion, OverlayTrigger, Tooltip } from 'react-bootstrap';

function Tariff() {
  const [tariffs, setTariffs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showOperationModal, setShowOperationModal] = useState(false);
  const [editingTariff, setEditingTariff] = useState(null);
  const [selectedTariff, setSelectedTariff] = useState(null);
  const [newTariff, setNewTariff] = useState({
    tarifeNo: '',
    name: '',
    details: [{ startTime: '', endTime: '', price: '' }],
  });
  const [operationValue, setOperationValue] = useState('');
  const [operation, setOperation] = useState('add');

  useEffect(() => {
    fetchTariffs();
  }, []);

  const fetchTariffs = () => {
    fetch('http://localhost:8080/api/tariffs')
      .then(response => response.json())
      .then(data => setTariffs(data))
      .catch(error => console.error('Error fetching tariffs:', error));
  };

  const handleAddDetail = () => {
    setNewTariff({
      ...newTariff,
      details: [...newTariff.details, { startTime: '', endTime: '', price: '' }],
    });
  };

  const handleDetailChange = (index, field, value) => {
    const newDetails = newTariff.details.map((detail, i) =>
      i === index ? { ...detail, [field]: value } : detail
    );
    setNewTariff({ ...newTariff, details: newDetails });
  };

  const handleDelete = (tarifeNo) => {
    if (window.confirm('Are you sure you want to delete this tariff?')) {
      fetch(`http://localhost:8080/api/v1/tariffs/tarifeNo/${tarifeNo}`, {
        method: 'DELETE',
      })
        .then(() => fetchTariffs())
        .catch(error => console.error('Error deleting tariff:', error));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = editingTariff
      ? `http://localhost:8080/api/v1/tariffs/tarifeNo/${editingTariff.tarifeNo}`
      : 'http://localhost:8080/api/v1/tariffs';
    const method = editingTariff ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTariff),
    })
      .then(() => {
        fetchTariffs();
        setShowModal(false);
        setEditingTariff(null);
      })
      .catch(error => console.error('Error submitting tariff:', error));

    setNewTariff({ tarifeNo: '', name: '', details: [{ startTime: '', endTime: '', price: '' }] });
  };

  const handleModifyPrice = (tariff) => {
    setSelectedTariff(tariff);
    setShowOperationModal(true);
  };

  const handleOperationSubmit = () => {
    if (!selectedTariff) return;

    fetch(`http://localhost:8081/api/v1/tariff-operations/tarifeNo/${selectedTariff.tarifeNo}/modify-price`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation, value: parseFloat(operationValue) }),
    })
      .then(() => {
        fetchTariffs();
        setShowOperationModal(false);
      })
      .catch(error => console.error('Error modifying price:', error));
  };

  const handleEditTariff = (tariff) => {
    setEditingTariff(tariff);
    setNewTariff({
      tarifeNo: tariff.tarifeNo,
      name: tariff.name,
      details: tariff.details,
    });
    setShowModal(true);
  };

  const handleAddNewTariff = () => {
    setEditingTariff(null);
    setNewTariff({ tarifeNo: '', name: '', details: [{ startTime: '', endTime: '', price: '' }] });
    setShowModal(true);
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Modify Tariff Price
    </Tooltip>
  );

  return (
    <Card className="shadow-lg p-5 bg-white rounded-lg mb-5">
      <Card.Header className="flex justify-between items-center">
        <h4 className="text-blue-600">Tariffs List</h4>
        <Button variant="primary" className="font-bold" onClick={handleAddNewTariff}>
          + Add New Tariff
        </Button>
      </Card.Header>
      <Card.Body>
        <Accordion>
          {Array.isArray(tariffs) && tariffs.map((tariff, index) => (
            <Accordion.Item eventKey={index.toString()} key={index}>
              <Accordion.Header>
                <strong>{tariff.tarifeNo}</strong> - {tariff.name}
              </Accordion.Header>
              <Accordion.Body>
                <Table striped bordered hover responsive className="shadow-sm">
                  <thead>
                    <tr className="bg-gray-700 text-white">
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tariff.details.map((detail, i) => (
                      <tr key={i}>
                        <td>{detail.startTime}</td>
                        <td>{detail.endTime}</td>
                        <td>{detail.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="flex mt-3">
                  <Button variant="warning" className="me-2" onClick={() => handleEditTariff(tariff)}>
                    Edit
                  </Button>
                  <Button variant="danger" className="me-2" onClick={() => handleDelete(tariff.tarifeNo)}>
                    Delete
                  </Button>
                  <OverlayTrigger placement="top" overlay={renderTooltip}>
                    <Button variant="info" className="me-2" onClick={() => handleModifyPrice(tariff)}>
                      Modify Price
                    </Button>
                  </OverlayTrigger>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Card.Body>

      {/* Modal for Adding/Editing Tariff */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingTariff ? 'Edit Tariff' : 'Add New Tariff'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTariffNo">
              <Form.Label>Tariff No</Form.Label>
              <Form.Control
                type="text"
                value={newTariff.tarifeNo}
                onChange={(e) => setNewTariff({ ...newTariff, tarifeNo: e.target.value })}
                required
                disabled={!!editingTariff}
              />
            </Form.Group>
            <Form.Group controlId="formTariffName" className="mt-3">
              <Form.Label>Tariff Name</Form.Label>
              <Form.Control
                type="text"
                value={newTariff.name}
                onChange={(e) => setNewTariff({ ...newTariff, name: e.target.value })}
                required
              />
            </Form.Group>

            {newTariff.details.map((detail, index) => (
              <div key={index} className="mt-3">
                <h6>Detail {index + 1}</h6>
                <Form.Group controlId={`formStartTime-${index}`}>
                  <Form.Label>Start Time (min)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Start Time"
                    value={detail.startTime}
                    onChange={(e) => handleDetailChange(index, 'startTime', e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId={`formEndTime-${index}`} className="mt-2">
                  <Form.Label>End Time (min)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="End Time"
                    value={detail.endTime}
                    onChange={(e) => handleDetailChange(index, 'endTime', e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId={`formPrice-${index}`} className="mt-2">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Price"
                    value={detail.price}
                    onChange={(e) => handleDetailChange(index, 'price', e.target.value)}
                    required
                  />
                </Form.Group>
              </div>
            ))}

            <Button variant="secondary" onClick={handleAddDetail} className="mt-3">
              Add Time Interval
            </Button>
            <Button variant="primary" type="submit" className="mt-3 ms-3">
              {editingTariff ? 'Update Tariff' : 'Save Tariff'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal for Modifying Price */}
      <Modal show={showOperationModal} onHide={() => setShowOperationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modify Price for {selectedTariff?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="operationType">
              <Form.Label>Operation Type</Form.Label>
              <Form.Control
                as="select"
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
              >
                <option value="add">Add</option>
                <option value="subtract">Subtract</option>
                <option value="multiply">Multiply</option>
                <option value="percentage">Percentage</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formNewPrice" className="mt-3">
              <Form.Label>Value</Form.Label>
              <Form.Control
                type="number"
                value={operationValue}
                onChange={(e) => setOperationValue(e.target.value)}
                placeholder="Enter value"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOperationModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleOperationSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}

export default Tariff;
