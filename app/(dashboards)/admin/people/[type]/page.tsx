"use client";
import { usePathname } from 'next/navigation';
import TopSubNavigation from '@/app/ui/dashboard/admin/top-sub-nav';
import React, { useState, useEffect } from "react";
import agGrid from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { LicenseManager } from 'ag-grid-enterprise';
LicenseManager.setLicenseKey(`${process.env.AG_GRID_ENTERPRISE_LICENSE}`);

import { deletePeopleHandler, peopleHandler } from "@/app/lib/actions/admin/people.action";
import useGridStateHook from '../../(utils)/gridStateHook';
import { useDisclosure } from '@nextui-org/react';
import FeedbackModal from '../../(components)/feedback-modal';

interface RowData {}

const options = {
  rowSelection: 'multiple',
  rowMultiSelectWithClick: true,
  enableRangeSelection: true,
  allowContextMenuWithControlKey: true,
  clipboardDeliminator: ',',
  suppressRowClickSelection: true,
  pagination: true,
};

const getOption = (pathname: string) => {
  const parts = pathname.split('/').filter(part => part !== '');
  const optionIndex = parts.indexOf('people');
  return parts[optionIndex + 1] || 'defaultProgram';
}

const fetchPeopleData = async (pathname: string, searchQuery: string = '', status: string = 'all'): Promise<any> => {
  console.log(`pathname: ${pathname}`);
  const option = getOption(pathname);

  try {
      const apps = await peopleHandler(option, searchQuery, status);
      console.log(`fetchPeopleData:`, apps);
      return apps || { columnDefs: [], rowData: [] };
  } catch (error) {
      console.error(error);
      return { columnDefs: [], rowData: [] };
  }
}

export default function Page() {
  const pathname = usePathname();
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [columnDefs, setColumnDefs] = useState<agGrid.ColDef[]>([]);
  const [gridApi, setGridApi] = useState<agGrid.GridApi | null>(null);
  const [gridOptions, setgridOptions] = useState<any>(options);
  const [selectedRows, setselectedRows] = useState(0);
  const [selectedRowsData, setselectedRowsData] = useState();
  const { saveFilterModel, saveColumnState } = useGridStateHook(gridApi, pathname);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    fetchPeopleData(pathname)
      .then((data: any) => {
        console.log('useEffect:', data);
        setColumnDefs(data.columnDefs || []);
        setRowData(data.rowData || []);
        setgridOptions(options);
      });
  }, [pathname]);

  useEffect(() => {
    if (gridApi && columnDefs.length > 0 && rowData.length > 0) {
      console.log('Applying state after columnDefs and rowData are set');
      const filterKey = `${pathname.split('/').filter(part => part !== '').join('-')}-filter`;
      const columnKey = `${pathname.split('/').filter(part => part !== '').join('-')}-column`;

      const savedFilterState = localStorage.getItem(filterKey);
      if (savedFilterState) {
        console.log('Applying filter state:', savedFilterState);
        gridApi.setFilterModel(JSON.parse(savedFilterState));
      }

      const savedColumnState = localStorage.getItem(columnKey);
      if (savedColumnState) {
        console.log('Applying column state:', savedColumnState);
        gridApi.applyColumnState({ state: JSON.parse(savedColumnState), applyOrder: true });
      }
    }
  }, [gridApi, columnDefs, rowData, pathname]);

  const defaultColDef: agGrid.ColDef = {
    sortable: true,
    resizable: true,
    filter: true,
    minWidth: 150,
    flex: 2,
    wrapText: true,
  };

  const onGridReady = (params: agGrid.GridReadyEvent) => {
    console.log('onGridReady:', params.api);
    setGridApi(params.api);
  };

  const onPaginationChanged = () => {
    console.log("onPaginationChanged");
  };

  const clearFilters = () => {
    if (gridApi) {
      gridApi.setFilterModel(null);
    }
  };

  const onSelectionChanged = (event: any) => {
    setselectedRows(event.api.getSelectedRows().length);
    setselectedRowsData(event.api.getSelectedRows());
  }

  const deleteSelectedRows = () => {

    if (selectedRows === 0) {
      setFeedbackTitle("Deletion Error")
      setFeedbackText("No rows have been selected for deletion.");
      onOpen();
      return;
    }
    
    const option = getOption(pathname);

    deletePeopleHandler(selectedRowsData, option)
    .then((deletedRows: any) => {
      setFeedbackTitle("Deletion Successful")
      setFeedbackText(deletedRows.length + " row(s) have been deleted.");
      onOpen();
      fetchPeopleData(pathname)
      .then((data:any) => {
        setRowData(data.rowData || []);
      });
    }).catch(() => {
      setFeedbackTitle("Deletion Error")
      setFeedbackText("An error has occured while trying to delete the specified rows. Please reach out for assistance if the issue persists.");
      onOpen();
    })
  }

  return (
    <div className="ag-theme-alpine grid-container">
      <div id="top-subnavigation" className="flex align-middle mb-4 text-lg text-[#4b5563] items-center">
        <TopSubNavigation
          fetchApps={fetchPeopleData}
          clearFilters={clearFilters}
          selectedRows={selectedRows}
          selectedRowsData={selectedRowsData}
          gridApi={gridApi}
          pathname={pathname}
          deleteSelectedRows={deleteSelectedRows}
          setRowData={setRowData}
          setColumnDefs={setColumnDefs}
        />
      </div>
      <AgGridReact
        className="ag-theme-quartz h-screen"
        columnDefs={columnDefs}
        rowData={rowData}
        defaultColDef={defaultColDef}
        gridOptions={gridOptions}
        onGridReady={onGridReady}
        rowSelection={"multiple"}
        pagination={true}
        paginationPageSize={50}
        onPaginationChanged={onPaginationChanged}
        onSelectionChanged={onSelectionChanged}
        onFilterChanged={saveFilterModel}
        onDragStopped={saveColumnState}
        onSortChanged={saveColumnState}
        onColumnPinned={saveColumnState}
        onColumnVisible={saveColumnState}
        maintainColumnOrder={true}
      ></AgGridReact>
      <FeedbackModal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        feedbackTitle={feedbackTitle}
        feedbackText={feedbackText}
      />
    </div>
  );
}
