import React, { useState, useEffect } from "react";
import "./Corrective_Action.css";

const TableComponent9976 = () => {
  // Define state to hold the fetched data
  const [data, setData] = useState([]);

  useEffect(() => {
    // Retrieve email from cookies
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
      const [key, value] = cookie.split("=");
      acc[key] = value;
      return acc;
    }, {});

    const email = cookies.email;

    if (email) {
      const apiUrl = `http://localhost:224/api/fetch_oil_under_supervision?loginUser=${email}`;
      console.log("Sending GET request to:", apiUrl);

      fetch(apiUrl)
        .then((response) => response.json())
        .then((responseData) => {
          console.log("Response from API:", responseData);
          // Set the response data into state
          setData(responseData);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else {
      console.warn("Email cookie not found.");
    }
  }, []);

  return (
    <div className="table-container-9976">
      <table className="data-table-9976">
        <thead>
          <tr>
            <th>Document Number</th>
            <th>Sample Number</th>
            <th>Functional Location</th>
            <th>Sample Collection Date</th>
            <th>Oil Material Code</th>
            <th>Oil Material Description</th>
            <th>Sample Status</th>
            <th>Sampling Decision</th>
            <th>Reason</th>
            <th>Decision Taken Date</th>
            <th>Last Oil Changed Date</th>
            <th>STATE</th>
            <th>AREA</th>
            <th>SITE</th>
            <th>PLANT CODE</th>
            <th>STATE ENGINEERING</th>
            <th>AREA INCHARGES</th>
            <th>SITE INCHARGE</th>
            <th>WTG_Wise_Planning</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.SERVICEORDER}</td>
              <td>{row.Sample_Number}</td>
              <td>{row.FUNCTIONAL_LOCATION}</td>
              <td>{row.Sample_Collection_Date}</td>
              <td>{row.Oil_Material_Code}</td>
              <td>{row.Oil_Material_Description}</td>
              <td>{row.STATUS}</td>
              <td>{row.Sampling_Decision}</td>
              <td>{row.Reason}</td>
              <td>{row.Decision_Taken_Date}</td>
              <td>{row.Last_Oil_Changed_Date}</td>
              <td>{row.STATE}</td>
              <td>{row.AREA}</td>
              <td>{row.SITE}</td>
              <td>{row.MAINTENANCE_PLANT}</td>
              <td>{row.STATE_ENGG_HEAD}</td>
              <td>{row.AREA_INCHARGE}</td>
              <td>{row.SITE_INCHARGE}</td>
              <td>{row.ORDERTYPES}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent9976;
