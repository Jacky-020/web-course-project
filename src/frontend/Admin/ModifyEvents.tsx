import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { gql, useMutation } from '@apollo/client';

// Define the GraphQL mutation for updating an event
const UPDATE_EVENT = gql`
    mutation UpdateEvent($input: UpdateEventInput!) {
        updateEvent(updateEventInput: $input) {
            id
            price_e
            presenter_e
            date_e
            en_title
            desc_e
        }
    }
`;

const EventForm = ({ existingEventData }) => {
    const [formData, setFormData] = useState({
        id: '',
        price_e: '$',
        presenter_e: '',
        date_e: '',
        en_title: '',
        desc_e: '', // Added description to formData
    });

    const [updateEvent] = useMutation(UPDATE_EVENT);

    // Load existing event data into the form if provided
    useEffect(() => {
        if (existingEventData) {
            setFormData({
                id: existingEventData.id,
                price_e: existingEventData.price_e,
                presenter_e: existingEventData.presenter_e,
                date_e: existingEventData.date_e,
                en_title: existingEventData.en_title,
                desc_e: existingEventData.desc_e || '', // Default to empty string if undefined
            });
        }
    }, [existingEventData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const inputData = {
                ...formData,
                id: Number.parseInt(formData.id),
            };
            const { data } = await updateEvent({ variables: { input: inputData } });
            alert('Event updated. Go check in the event page' );
        } catch (error) {
            alert('Error updating event. Please makes sure you have entered a valid event id');
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Event ID</InputGroup.Text>
                <Form.Control
                    name="id"
                    placeholder="Event ID"
                    aria-label="Event ID"
                    aria-describedby="basic-addon1"
                    value={formData.id}
                    onChange={handleChange}
                />
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Event Title</InputGroup.Text>
                <Form.Control
                    name="en_title"
                    placeholder="Event title"
                    aria-label="Event Title"
                    aria-describedby="basic-addon1"
                    value={formData.en_title}
                    onChange={handleChange}
                />
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Date / Time</InputGroup.Text>
                <Form.Control
                    name="date_e"
                    placeholder="Date / Time"
                    aria-label="Date / Time"
                    aria-describedby="basic-addon1"
                    value={formData.date_e}
                    onChange={handleChange}
                />
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Presenter</InputGroup.Text>
                <Form.Control
                    name="presenter_e"
                    placeholder="Presenter"
                    aria-label="Presenter"
                    aria-describedby="basic-addon1"
                    value={formData.presenter_e}
                    onChange={handleChange}
                />
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text>Price: </InputGroup.Text>
                <Form.Control
                    name="price_e"
                    aria-label="Price"
                    value={formData.price_e}
                    onChange={handleChange}
                />
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text>Description</InputGroup.Text>
                <Form.Control
                    as="textarea"
                    name="desc_e"
                    aria-label="With textarea"
                    rows={5}
                    value={formData.desc_e}
                    onChange={handleChange}
                />
            </InputGroup>

            <Button variant="primary" type="submit">
                Update
            </Button>
        </Form>
    );
};

export default EventForm;