import React, { Component } from 'react';
import Pdf from '../Assets/Documents/2022Feb12LokDhabaCodebook.pdf';

export default class Documentation extends Component {
  render() {
    return (
      <div className="content overflow-auto">
        <div className="text-content">

          <h1>Documentation</h1>
          <p>Please refer to the <a href={Pdf} target="_blank">Lok Dhaba Codebook</a> to understand the fields in this
  dataset.</p>
          <h3>TCPD-IED: TCPD Indian Elections Dataset</h3>
          <p>If a variable(s) drawn from the TCDP-IED dataset plays an important role in your project (published or
  unpublished), please use all the suggested citations below: </p>
          <p><strong>Data:</strong> Ananay Agarwal, Neelesh Agrawal, Saloni Bhogale, Sudheendra Hangal, Francesca Refsum Jensenius, Mohit Kumar, Chinmay Narayan, Basim U Nissa, Priyamvada Trivedi, and Gilles Verniers. 2021. “TCPD Indian Elections Data v2.0", Trivedi Centre for Political Data, Ashoka University.
</p>
          <p><strong>Codebook:</strong> Ananay Agarwal, Neelesh Agrawal, Saloni Bhogale, Sudheendra Hangal, Francesca Refsum Jensenius, Mohit Kumar, Chinmay Narayan, Basim U Nissa, Priyamvada Trivedi, and Gilles Verniers. 2021. “TCPD Indian Election Data Codebook v2.0", Trivedi Centre for Political Data, Ashoka University</p>
          <h3>TCPD-IID: TCPD Individual Incumbency Dataset</h3>
          <p>If a variable(s) drawn from the TCPD-IID dataset plays an important role in your project (published or
  unpublished), please use all the suggested citations below: </p>
          <p><strong>Data:</strong> “TCPD Individual Incumbency Dataset, 1962-current”. Trivedi Centre for Political Data, Ashoka University.
</p>
  <p><strong>Codebook:</strong> Ananay Agarwal, Saloni Bhogale, Sudheendra Hangal, Mohit Kumar, Basim U Nissa, and Gilles Verniers. 2021. “TCPD Individual Incumbency Dataset, 1962-current Codebook 2.0", Trivedi Centre for Political Data, Ashoka University.
</p>
          <h3>Spatial Data</h3>
          <p><strong>Source:</strong> DataMeet Trust, Bangalore, India</p>
          <h3>Publications</h3>
          <p>Please notify us about any publications that result from the use of any of our datasets (TCDP-IED and TCPD-IID) by sending your bibliographic citation and information on your publication to tcpd-contact@ashoka.edu.in
</p>
          <p>If you are a news agency citing our data in your publication, kindly mention that the data was sourced from the Trivedi Centre for Political Data. You can also point to our website in your web articles: http://lokdhaba.ashoka.edu.in/ </p>

        </div>
      </div>
    )
  }
}
