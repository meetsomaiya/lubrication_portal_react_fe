import React, { useState, useEffect } from "react";
import "./Corrective_Action.css";

const TableComponent9976 = () => {
  const [data] = useState([
    {
      documentNumber: "20970299",
      sampleNumber: "55261973",
      functionalLocation: "SWSKTD-SC1-ASI01-RWS021",
      sampleCollectionDate: "19-Jun-24",
      oilMaterialCode: "51028448",
      oilMaterialDescription: "OIL MOBILGEAR SHC XMP 460",
      sampleStatus: "Completed",
      samplingDecision: "Oil under Supervision",
      reason: "Hgh WEinspt flt&SGB,>50%CLR chg,rplc SGB",
      decisionTakenDate: "14-Aug-24",
      lastOilChangedDate: "16-May-24",
      state: "DATA COMES FROM INSTALLED BASE",
      area: "DATA COMES FROM INSTALLED BASE",
      site: "DATA COMES FROM INSTALLED BASE",
      plantCode: "DATA COMES FROM INSTALLED BASE",
      stateEngineering: "WILL PROVIDE BY ME",
      areaIncharges: "WILL provide BY ME",
      siteIncharge: "Will provide BY ME",
      WTG_Wise_Planning: "Will provide by me",
    },
  ]);

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
              <td>{row.documentNumber}</td>
              <td>{row.sampleNumber}</td>
              <td>{row.functionalLocation}</td>
              <td>{row.sampleCollectionDate}</td>
              <td>{row.oilMaterialCode}</td>
              <td>{row.oilMaterialDescription}</td>
              <td>{row.sampleStatus}</td>
              <td>{row.samplingDecision}</td>
              <td>{row.reason}</td>
              <td>{row.decisionTakenDate}</td>
              <td>{row.lastOilChangedDate}</td>
              <td>{row.state}</td>
              <td>{row.area}</td>
              <td>{row.site}</td>
              <td>{row.plantCode}</td>
              <td>{row.stateEngineering}</td>
              <td>{row.areaIncharges}</td>
              <td>{row.siteIncharge}</td>
              <td>{row.WTG_Wise_Planning}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent9976;
