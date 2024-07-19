"use client";

import React, { useEffect, useState, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi } from 'ag-grid-community';
import { getSalesEntry, updateSalesEntry } from '@/components/dashboard/sales-entry/sales-service';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  TableContainer,
  FormControlLabel,
  Table,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

interface SalesEntry {
  id: number;
  type?: string;
  year: number;
  company?: string;
  month: number;
  material_Code?: string;
  products?: string;
  product_Category_Detail?: string;
  dd?: string;
  mapping_Report?: string;
  division?: string;
  customer_Group?: string;
  customer_Code?: string;
  customer_Name?: string;
  quantity: number;
  selling_Price: number;
  currency?: string;
  rate: number;
  total_Sales: number;
  am_Number: number;
  cogs: number;
  margin: number;
  log_Sales_Id?: string;
}

const SalesEntryTable: React.FC = () => {
  const [SalesEntry, setSalesEntry] = useState<SalesEntry[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [columnDefs, setColumnDefs] = useState<ColDef<SalesEntry>[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [columnPinning, setColumnPinning] = useState<Record<string, boolean>>({});
  const [changes, setChanges] = useState<Record<number, SalesEntry>>({});
  const gridApi = useRef<GridApi | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSalesEntry();
        setSalesEntry(data);
      } catch (error) {
        console.error('Error fetching SalesEntry data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const initialColumnDefs: ColDef<SalesEntry>[] = [
      { field: 'id', headerName: 'ID', sortable: true, filter: true, editable: true },
      { field: 'type', headerName: 'Type', sortable: true, filter: true, editable: true },
      { field: 'year', headerName: 'Year', sortable: true, filter: true, editable: true },
      { field: 'company', headerName: 'Company', sortable: true, filter: true, editable: true },
      { field: 'month', headerName: 'Month', sortable: true, filter: true, editable: true },
      { field: 'material_Code', headerName: 'Material Code', sortable: true, filter: true, editable: true },
      { field: 'products', headerName: 'Products', sortable: true, filter: true, editable: true },
      { field: 'product_Category_Detail', headerName: 'Product Category Detail', sortable: true, filter: true, editable: true },
      { field: 'dd', headerName: 'DD', sortable: true, filter: true, editable: true },
      { field: 'mapping_Report', headerName: 'Mapping Report', sortable: true, filter: true, editable: true },
      { field: 'division', headerName: 'Division', sortable: true, filter: true, editable: true },
      { field: 'customer_Group', headerName: 'Customer Group', sortable: true, filter: true, editable: true },
      { field: 'customer_Code', headerName: 'Customer Code', sortable: true, filter: true, editable: true },
      { field: 'customer_Name', headerName: 'Customer Name', sortable: true, filter: true, editable: true },
      { field: 'quantity', headerName: 'Quantity', sortable: true, filter: true, editable: true },
      { field: 'selling_Price', headerName: 'Selling Price', sortable: true, filter: true, editable: true },
      { field: 'currency', headerName: 'Currency', sortable: true, filter: true, editable: true },
      { field: 'rate', headerName: 'Rate', sortable: true, filter: true, editable: true },
      { field: 'total_Sales', headerName: 'Total Sales', sortable: true, filter: true, editable: true },
      { field: 'am_Number', headerName: 'AM Number', sortable: true, filter: true, editable: true },
      { field: 'cogs', headerName: 'COGS', sortable: true, filter: true, editable: true },
      { field: 'margin', headerName: 'Margin', sortable: true, filter: true, editable: true },
      { field: 'log_Sales_Id', headerName: 'Log Sales ID', sortable: true, filter: true, editable: true }
    ];
    setColumnDefs(initialColumnDefs);

    const visibility: Record<string, boolean> = {};
    const pinning: Record<string, boolean> = {};
    initialColumnDefs.forEach(col => {
      visibility[col.field!] = true;
      pinning[col.field!] = false;
    });
    setColumnVisibility(visibility);
    setColumnPinning(pinning);
  }, []);

  const onCellValueChanged = (params: any) => {
    const { data } = params;
    setChanges(prevChanges => ({ ...prevChanges, [data.id]: data }));
  };

  const submitChanges = async () => {
    try {
      await Promise.all(Object.values(changes).map(change => updateSalesEntry(change.id, change)));
      setSalesEntry(prevData =>
        prevData.map(SalesEntry => {
          const change = changes[SalesEntry.id];
          return change ? { ...SalesEntry, ...change } : SalesEntry;
        })
      );
      setChanges({});
    } catch (error) {
      console.error('Error submitting changes:', error);
    }
  };

  const onGridReady = (params: { api: GridApi }) => {
    gridApi.current = params.api;
  };

  const handleSettingsOpen = () => {
    setSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
  };

  const handleColumnVisibilityChange = (field: string) => {
    const newVisibility = !columnVisibility[field];
    setColumnVisibility(prev => ({ ...prev, [field]: newVisibility }));
    gridApi.current?.setColumnsVisible([field], newVisibility);
  };

  const handleColumnPinChange = (field: string) => {
    const newPinning = !columnPinning[field];
    setColumnPinning(prev => ({ ...prev, [field]: newPinning }));
    gridApi.current?.applyColumnState({
      state: [{ colId: field, pinned: newPinning ? 'left' : null }],
      applyOrder: true,
    });
  };

  const handleResetSettings = () => {
    const resetVisibility: Record<string, boolean> = {};
    const resetPinning: Record<string, boolean> = {};
    columnDefs.forEach(col => {
      resetVisibility[col.field!] = true;
      resetPinning[col.field!] = false;
    });
    setColumnVisibility(resetVisibility);
    setColumnPinning(resetPinning);
    gridApi.current?.resetColumnState();
  };

  const updateRowData = () => {
    gridApi.current?.applyTransaction({ update: Object.values(changes) });
  };

  useEffect(() => {
    if (gridApi.current) {
      gridApi.current.addEventListener('undoEnded', updateRowData);
      gridApi.current.addEventListener('redoEnded', updateRowData);

      return () => {
        gridApi.current?.removeEventListener('undoEnded', updateRowData);
        gridApi.current?.removeEventListener('redoEnded', updateRowData);
      };
    }
  }, [changes]);

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <div className="ag-theme-quartz" style={{ height: '600px' }}>
        <AgGridReact
          rowData={SalesEntry}
          columnDefs={columnDefs}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
          }}
          pagination={true}
          paginationPageSize={20}
          paginationPageSizeSelector={[20, 30]}
          onGridReady={onGridReady}
          onCellValueChanged={onCellValueChanged}
          rowSelection="multiple"
          animateRows={true}
        />
      </div>
      <Button
        onClick={handleSettingsOpen}
        sx={{
          position: 'absolute',
          bottom: 60,
          left: 10,
          '&:hover': {
            backgroundColor: 'action.hover',
          },
          zIndex: 1000,
          color: 'black'
        }}
      >
        <TuneIcon />
        <Typography variant="caption" sx={{ ml: 1 }}>
          Column Settings
        </Typography>
      </Button>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, float: 'right' }}>
        <Button onClick={submitChanges} variant="contained" color="primary">
          Submit Changes
        </Button>
      </Box>
      <Dialog open={settingsOpen} onClose={handleSettingsClose} maxWidth="md" fullWidth>
        <DialogTitle>Column Settings</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableBody>
                {columnDefs.map(col => (
                  <TableRow key={col.field}>
                    <TableCell>{col.headerName}</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={columnVisibility[col.field!]}
                            onChange={() => handleColumnVisibilityChange(col.field!)}
                            color="primary"
                          />
                        }
                        label={<Typography variant="body2">Show</Typography>}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={columnPinning[col.field!]}
                            onChange={() => handleColumnPinChange(col.field!)}
                            color="primary"
                            disabled={!columnVisibility[col.field!]}
                          />
                        }
                        label={<Typography variant="body2">Pin</Typography>}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetSettings} variant="outlined" color="secondary">
            Reset
          </Button>
          <Button onClick={handleSettingsClose} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SalesEntryTable;
