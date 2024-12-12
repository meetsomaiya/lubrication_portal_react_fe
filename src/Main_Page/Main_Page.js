import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import './LubeTable.css';  // Import the CSS file

const createData = (location, plant, order, status, startDate, endDate, orderType, plannedDate, delay) => {
  return { location, plant, order, status, startDate, endDate, orderType, plannedDate, delay };
};

const rows = [
  createData('SWSPAI-SC2-RS102-PI12', 4446, '0018165907', 'Technically Completed', '24-04-2022', '24-04-2022', 'QI_LUB_2022', '21-04-2022', 3),
  createData('SWSPAI-SC2-RS102-PI12', 4446, '0018165907', 'Technically Completed', '24-04-2022', '24-04-2022', 'QI_LUB_2022', '21-04-2022', 15),
  createData('SWSPAI-SC2-RS102-PI12', 4446, '0018165907', 'Technically Completed', '24-04-2022', '24-04-2022', 'QI_LUB_2022', '21-04-2022', 8),
  createData('SWSPAI-SC2-RS102-PI12', 4446, '0018165907', 'Technically Completed', '24-04-2022', '24-04-2022', 'QI_LUB_2022', '21-04-2022', 10),
  createData('SWSPAI-SC2-RS102-PI12', 4446, '0018165907', 'Technically Completed', '24-04-2022', '24-04-2022', 'QI_LUB_2022', '21-04-2022', 100),
  createData('SWSPAI-SC2-RS102-PI12', 4446, '0018165907', 'Technically Completed', '24-04-2022', '24-04-2022', 'QI_LUB_2022', '21-04-2022', 75),
  createData('SWSPAI-SC2-RS102-PI12', 4446, '0018165907', 'Technically Completed', '24-04-2022', '24-04-2022', 'QI_LUB_2022', '21-04-2022', 3),
];

const getDelayChip = (delay) => {
  if (delay <= 7) {
    return <Chip label={delay} className="lub-chip-success" style={{backgroundColor: 'Green'}} />;
  } else if (delay > 7 && delay <= 30) {
    return <Chip label={delay} className="lub-chip-warning" style={{backgroundColor: '#FDC5CB'}} />;
  } else if (delay > 30 && delay <= 60) {
    return <Chip label={delay} className="lub-chip-warning" style={{backgroundColor: '#F998A1'}} />;
  } else if (delay > 60 && delay <= 90) {
    return <Chip label={delay} className="lub-chip-warning" style={{backgroundColor: '#F2707D'}} />;
  } else {
    return <Chip label={delay} className="lub-chip-error" style={{backgroundColor: '#D51426'}} />;
  }
};

const App = () => {
  return (
    <div className="lub-table-wrapper"style={{width:'90%',height:'10%',marginTop:'100px'}}>
      <TableContainer component={Paper} className="lub-table-container">
        <Table>
          <TableHead className="lub-table-head">
            <TableRow>
              <TableCell className="lub-table-head-cell">Functional Location</TableCell>
              <TableCell className="lub-table-head-cell">Plant</TableCell>
              <TableCell className="lub-table-head-cell">Order No.</TableCell>
              <TableCell className="lub-table-head-cell">Status</TableCell>
              <TableCell className="lub-table-head-cell">Start Date</TableCell>
              <TableCell className="lub-table-head-cell">End Date</TableCell>
              <TableCell className="lub-table-head-cell">Order Type</TableCell>
              <TableCell className="lub-table-head-cell">Planned Date</TableCell>
              <TableCell className="lub-table-head-cell">Delays</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="lub-table-cell">{row.location}</TableCell>
                <TableCell className="lub-table-cell">{row.plant}</TableCell>
                <TableCell className="lub-table-cell">{row.order}</TableCell>
                <TableCell className="lub-table-cell">{row.status}</TableCell>
                <TableCell className="lub-table-cell">{row.startDate}</TableCell>
                <TableCell className="lub-table-cell">{row.endDate}</TableCell>
                <TableCell className="lub-table-cell">{row.orderType}</TableCell>
                <TableCell className="lub-table-cell">{row.plannedDate}</TableCell>
                <TableCell className="lub-table-cell">{getDelayChip(row.delay)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default App;
