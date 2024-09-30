import React from 'react';
import { Card, Button, ListGroup } from 'react-bootstrap';

const PackageCard = ({ pkg, onEdit, onDelete }) => {
    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Title>{pkg.packageName}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{pkg.customerTypeName}</Card.Subtitle>
                <Card.Text>
                    {pkg.packageDescription}
                </Card.Text>
                <ListGroup variant="flush">
                    {pkg.vehicleTypes.map((vehicle, index) => (
                        <ListGroup.Item key={index}>
                            <strong>{vehicle.vehicleTypeName}</strong>
                            <div>
                                Tariffs:
                                <ul>
                                    {vehicle.tariffs.map(tariff => (
                                        <li key={tariff.tariffNo}>
                                            {tariff.tariffName} (Active: {vehicle.activeTariffNo === tariff.tariffNo ? 'Yes' : 'No'})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <Button variant="primary" onClick={() => onEdit(pkg)}>Edit</Button>
                <Button variant="danger" onClick={() => onDelete(pkg.id)} className="ml-2">Delete</Button>
            </Card.Body>
        </Card>
    );
};

export default PackageCard;
