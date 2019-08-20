import React, { Component } from 'react';
import { Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Modal extends Component {
  constructor(props){
        super(props);
      }

  handleClose = () => {
    this.props.handleClose();
  }

onSubmit = () => {
  this.props.onSubmit();
}

  render() {
    var id = this.props.id;
    var show = this.props.show;
    var body
     return (
       <div id={id}>
          <Modal show={show} onHide={this.handleClose}>
           <Modal.Header closeButton>
             <Modal.Title>{this.props.heading}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{this.props.body}</Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={this.handleClose}>
                 Cancel
                 </Button>
                 <Button variant="primary" onClick={this.onSubmit}>
                 Save
                 </Button>
            </Modal.Footer>
           </Modal>
       </div>
     )
   }
}
