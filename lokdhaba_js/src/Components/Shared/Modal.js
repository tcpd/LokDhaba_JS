import React, { Component } from 'react';
import { Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Modal extends Component {
  constructor(props){
        super(props);
      }

  render() {
    var id = this.props.id;
    var show = this.props.show;
     return (
       <div id={id}>
          <Modal show={show} onHide={this.props.handleClose}>
           <Modal.Header closeButton>
             <Modal.Title>{this.props.heading}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{this.props.body}</Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={this.props.handleClose}>
                 Cancel
                 </Button>
                 <Button variant="primary" onClick={this.props.onSubmit}>
                 Save
                 </Button>
            </Modal.Footer>
           </Modal>
       </div>
     )
   }
}
