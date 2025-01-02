import React, { useState } from "react";
import "./TableComponent9976.css";

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
      areaIncharges: "WILL PROVIDE BY ME",
      siteIncharge: "WILL PROVIDE BY ME",
    },
    // Add more entries here
  ]);

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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent9976;
