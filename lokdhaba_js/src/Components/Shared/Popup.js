/*
A popup componnet to display a dialogue
Accepts following props:
id: root id for the popup element
show: boolean to indicate whether the modal is open
heading, body, footer -> respective components for header, body and footer in the popup
handleClose: function to call when the user click the cross icon
*/

import React, { Component } from 'react';
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
         <div className="modal-dialog modal-lg">
           <div className="modal-content">

             <div className="modal-header">
               <h4 className="modal-title"><center>{this.props.heading}</center></h4>
               <button type="button" className="close" style={{opacity: "1"}} onClick={this.handleClose}>&times;</button>
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
