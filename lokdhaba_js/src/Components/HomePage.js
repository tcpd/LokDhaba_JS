import React, { Component } from 'react';

export default class HomePage extends Component {
  render() {
    return (
      <div className="content overflow-auto">
        <div className="text-content">
          <p> Welcome to Lok Dhaba!</p>
          <p> Lok Dhaba is a repository of Indian election results - both Vidhan Sabha (state level) and Lok Sabha
                (national level) - beginning 1962.</p>
          <p> 
            We have recently updated Lok Dhaba with the results of the Gujarat and Himachal Pradesh 
            Vidhan Sabha 2022 elections. These results are provisional, and will be finalized once the 
            Election Commission of India issues its final reports.

            Please note that the detailed data for voter turnout across these states is also released later by
            the Election Commission. As a result, you will find voter turnout visualizations for these elections to 
            show null data for now.
          </p>
          {/* <p>
            We're updating Lok Dhaba with the vote counts from 2022 Himachal Pradesh and Gujarat assembly elections,
            taken directly from the Election Commission of India's website. These counts are provisional and updated every few hours,
            until the last vote is counted. As the votes are still being counted, the 'Position' variable for these 2 elections 
            has been populated with dummy values (Eg. -1).
          </p> */}
          <p> 
            We have built a data <a href="/dash">dashboard</a> that builds on the data available 
            via Lok Dhaba to provide a broad overview of the 7 states for which elections have taken place
            this year. The available metrics show change between 2017 and 2022 for the states of Goa, Manipur, Punjab,
            Uttarakhand, Uttar Pradesh, Himachal Pradesh and Gujarat.
          </p>
          <p> The data in Lok Dhaba comes originally from the <a href="https://www.eci.gov.in/statistical-report/statistical-reports/">statistical reports </a>
            published by the Election Commission of India. We have cleaned and treated the data and organized it
            in a tabular format (which you can see under the “Browse Data” tab). In addition, we have integrated
            data from bypolls and assigned each contestant a person ID. The latter lets us track individuals'
            career trajectories over time and is the first of its kind in the context of Indian politics. Using
                this information, our data allows identification of turncoats and incumbents.</p>
          <p> The Lok Dhaba data is free and open for anyone to use. We encourage students, researchers, media
                persons, policy makers and others to engage with our data. Read <a href="https://tcpd.ashoka.edu.in/press-articles/">what we have published</a> using this data
                and <a href="https://tcpd.ashoka.edu.in/data-quoted/">how its been used by others</a>. Should
                you have any query and/or notice an error, please send us a message or write us at <a href="mailto:tcpd-contact@ashoka.edu.in">tcpd-contact@ashoka.edu.in</a>.</p>
          <p> For more information, please see the documentation tab, which includes a detailed
              codebook containing all the variables in Lok Dhaba. Should you use any information
              from Lok Dhaba, please be sure to cite the Trivedi Center for Political Data at
                Ashoka University.</p>
        </div>
      </div>
    )
  }
}
