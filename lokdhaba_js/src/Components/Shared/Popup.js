import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../Assets/Styles/layout.css'

export default class Popup extends Component {

  handleClose = () => {
    this.props.handleClose();
  }

  render() {
    var id = this.props.id;
    var show = this.props.show;
    const showHideClassName = show ? "modal display-block" : "modal display-none";
     return (
       <div className={showHideClassName} id={id}>
         <div className="modal-dialog modal-xl">
           <div className="modal-content">

             <div className="modal-header">
               <h4 className="modal-title"><center>{this.props.heading}</center></h4>
               <button type="button" className="close" data-dismiss="modal" onClick={this.handleClose}>&times;</button>
             </div>

             <div className="modal-body">
               {this.props.body}
             </div>

             <div className="modal-footer">
                {this.props.footer}
             </div>

           </div>
         </div>
       </div>
     )
   }
}
