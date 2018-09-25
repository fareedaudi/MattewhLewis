import React from 'react';
import {Modal,ModalHeader,ModalBody,ModalFooter,Button} from 'reactstrap';
import PropTypes from 'prop-types';

const DeleteMapModal = (props) => (
    <Modal isOpen={props.isOpen} toggle={props.toggle} className={props.className}>
        <ModalHeader toggle={props.toggle}>Delete <strong>{props.map_name}</strong>?</ModalHeader>
        <ModalBody>
        <p>This action is irreversible.</p>
        <p>Are you sure you want to delete this map?</p>
        </ModalBody>
        <ModalFooter>
            <Button color="secondary" onClick={props.toggle}>Close</Button>
            <Button color="danger" name="delete-map-button" onClick={()=>{props.handler(props.map_id)}}>Delete FOR-EV-ER</Button>
        </ModalFooter>
    </Modal>
);

DeleteMapModal.propTypes = {
    isOpen:PropTypes.bool.isRequired,
    toggle:PropTypes.func.isRequired,
    map_name:PropTypes.string.isRequired,
    handler:PropTypes.func.isRequired,
    map_id:PropTypes.string.isRequired
}

export default DeleteMapModal;