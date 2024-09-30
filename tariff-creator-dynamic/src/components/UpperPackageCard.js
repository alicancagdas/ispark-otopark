import React, { useState } from 'react';
import { Card, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';

function UpperPackageCard({ upperPackage, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPackage, setEditedPackage] = useState(upperPackage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete the upper package: ${upperPackage.upperPackageName}?`)) {
      onDelete(upperPackage.upperPackageNo);
    }
  };

  const handleSaveChanges = () => {
    if (editedPackage.upperPackageName && editedPackage.upperPackageDescription) {
      setIsSubmitting(true);
      onEdit(editedPackage)
        .then(() => {
          setIsEditing(false);
        })
        .catch((error) => {
          setErrorMessage('An error occurred while editing the package.');
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } else {
      setErrorMessage('Please fill out all fields.');
    }
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <h5>{upperPackage.upperPackageName}</h5>
        <p>{upperPackage.upperPackageDescription}</p>

        {/* Edit Modal */}
        <Modal show={isEditing} onHide={() => setIsEditing(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Upper Package</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Upper Package Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editedPackage.upperPackageName}
                  onChange={(e) =>
                    setEditedPackage({ ...editedPackage, upperPackageName: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Upper Package Description</Form.Label>
                <Form.Control
                  type="text"
                  value={editedPackage.upperPackageDescription}
                  onChange={(e) =>
                    setEditedPackage({ ...editedPackage, upperPackageDescription: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveChanges} disabled={isSubmitting}>
              {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </Modal>

        <Button variant="warning" className="me-2" onClick={handleEditClick}>
          Edit
        </Button>
        <Button variant="danger" onClick={handleDeleteClick}>
          Delete
        </Button>
      </Card.Body>
    </Card>
  );
}

export default UpperPackageCard;
