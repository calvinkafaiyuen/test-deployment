"use client";

import { usePathname } from 'next/navigation';
import TopSubNavigation from '@/app/ui/dashboard/admin/top-sub-nav';
import React, { useState, useEffect } from "react";
import agGrid from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { LicenseManager } from  'ag-grid-enterprise';
LicenseManager.setLicenseKey(`${process.env.AG_GRID_ENTERPRISE_LICENSE}`);

import { deleteProgramApplications, getProgramApplications, updateCohorts } from "@/app/lib/actions/admin/programs.action";
import useGridStateHook from '../../(utils)/gridStateHook';
import { useDisclosure } from '@nextui-org/react';
import FeedbackModal from '../../(components)/feedback-modal';
import LinkRenderer from '../../(components)/team-link';

interface RowData {}

const options = {
  rowSelection: 'multiple',
  rowMultiSelectWithClick: true,
  enableRangeSelection: true,
  allowContextMenuWithControlKey: true,
  clipboardDeliminator: ',',
  suppressRowClickSelection: true,
  pagination: true
};

const statusClasses = {
    'bg-green-300': (params: { value: string; }) => params.value === "ACCEPTED",
    'bg-gray-300': (params: { value: string; }) => ["Pending", "pending"].includes(params.value),
    'bg-blue-300': (params: { value: string; }) => params.value === "Declined",
    'bg-red-300': (params: { value: string; }) => params.value === "Not Eligible",
    'bg-orange-300': (params: { value: string; }) => params.value === "Interviewing",
    'bg-yellow-300': (params: { value: string; }) => params.value === "Conditional",
    'bg-lime-300': (params: { value: string; }) => params.value === "Launched",
    'bg-pink-300': (params: { value: string; }) => params.value === "Reviewing",
    'bg-purple-300': (params: { value: string; }) => params.value === "Looking For Cofounders",
    'bg-indigo-300': (params: { value: string; }) => params.value === "Discontinued",
    'bg-fuchsia-300': (params: { value: string; }) => params.value === "Dropped Out",
    'bg-rose-300': (params: { value: string; }) => params.value === "Funded",
    'bg-stone-300': (params: { value: string; }) => params.value === "Withdrawn"
}

const getOption = (pathname: string) => {
  const parts = pathname.split('/').filter(part => part !== '');
  const optionIndex = parts.indexOf('programs');
  return parts[optionIndex + 1] || 'defaultProgram';
}

const fetchProgramApplications = async (pathname: string, searchQuery: string = '', status: string = 'all'): Promise<any> => {
  console.log(`pathname: ${pathname}`);
  const program = getOption(pathname);

  try {
      const apps = await getProgramApplications(program, searchQuery, status);
      console.log(`fetchProgramApplications:`, apps);
      return apps || { columnDefs: [], rowData: [] };
  } catch (error) {
      console.error(error);
      return []; // Always return an array
  }
}

export default function Page() {
  const pathname = usePathname();
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [gridApi, setGridApi] = useState<agGrid.GridApi | null>(null);
  const [gridOptions, setgridOptions] = useState<any>([]);
  const [selectedRows, setselectedRows] = useState(0);
  const [selectedRowsData, setselectedRowsData] = useState();
  const { saveFilterModel, saveColumnState } = useGridStateHook(gridApi, pathname);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    fetchProgramApplications(pathname)
    .then((data:any) => {
        setRowData(data.rowData || []);
        setgridOptions(options)
    });

  },[pathname]);

  const columnDefs: agGrid.ColDef[] = [
    { headerName: 'Status(E)', cellClassRules: statusClasses, cellEditorPopup: true, field: 'status', width: 150, editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Interviewing', 'Conditional', 'ACCEPTED', 'Declined', 'Pending', 'Not Eligible', 'Withdrawn', 'Launched', 'Reviewing', 'Discontinued', 'Dropped Out', 'Looking For Cofounders', 'Funded'] }, filter: 'agTextColumnFilter' },
    { headerName: 'ID(P)', cellRenderer: LinkRenderer, field: 'team_id', checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, width: 150, filter: 'agTextColumnFilter' },
    { headerName: 'Team(E)', cellEditorPopup: true, field: 'team_name', filter: 'agTextColumnFilter', editable: true, cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 } },
    { headerName: 'Date', field: 'date', filter: 'agDateColumnFilter', width: 150 },
    { headerName: 'Initial Name', field: 'original_name', filter: 'agTextColumnFilter' },
    { headerName: 'Problem Statement', cellEditorPopup: true, field: 'problem_statement_text', filter: 'agTextColumnFilter', editable: true, cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 }, width: 200 },
    { headerName: 'Size', field: 'size', filter: 'agNumberColumnFilter', width: 100 },
    { headerName: 'Cohort', field: 'cohort', filter: 'agTextColumnFilter', width: 150 },
    { headerName: 'Basis for Development Solution', field: 'development_solution', filter: 'agTextColumnFilter', editable: true, cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 }, width: 200 },
    { headerName: 'Basis for Development Solution Link', field: 'development_solution_link', filter: 'agTextColumnFilter', editable: true, cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 }, width: 200 },
    { headerName: 'Startup Technology', field: 'startup_technology', filter: 'agTextColumnFilter', editable: true, cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 }, width: 200 },
    { headerName: 'Progress(E)', cellEditorPopup: true, field: 'progress', width: 150, editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['ACTIVE', 'WITHDRAWN'] }, cellClassRules: { accepted: params => params.value === "ACTIVE", declined: params => params.value === "WITHDRAWN" }, filter: 'agTextColumnFilter' },
    { headerName: 'Nomination(E)', cellEditorPopup: true, field: 'nomination', width: 180, editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['YES', 'NO'] }, cellClassRules: { accepted: params => params.value === "YES", declined: params => params.value === "NO" }, filter: 'agTextColumnFilter' },
    { headerName: 'Demo Day(E)', cellEditorPopup: true, field: 'demo_day', width: 150, editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['YES', 'NO'] }, cellClassRules: { accepted: params => params.value === "YES", declined: params => params.value === "NO" }, filter: 'agTextColumnFilter' },
    { headerName: 'Go-To-Market(E)', cellEditorPopup: true, field: 'go_to_market', width: 180, editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['YES', 'NO'] }, cellClassRules: { accepted: params => params.value === "YES", declined: params => params.value === "NO" }, filter: 'agTextColumnFilter' },
    { headerName: 'Triage', field: 'triage', width: 180, editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['YES', 'NO', 'CONTRACT EXPIRED', 'LEFT TRIAGE'] }, cellClassRules: { accepted: params => params.value === "YES", declined: params => params.value === "NO" }, filter: 'agTextColumnFilter' },
    { headerName: 'Promo', field: 'promo', filter: 'agTextColumnFilter', editable: true, cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 } },
    { headerName: 'Seed Funding', cellEditorPopup: true, field: 'prizes', width: 150, editable: true, cellEditor: 'agLargeTextCellEditor', cellEditorParams: { maxLength: 1000, cols: 60, rows: 6 }, filter: 'agTextColumnFilter' }
  ];


  const defaultColDef: agGrid.ColDef = {
    sortable: true,
    resizable: true,
    filter: true,
    minWidth: 150,
    flex: 2,
    wrapText: true,
  };

  const onGridReady = (params: agGrid.GridReadyEvent) => {
    setGridApi(params.api);
  };

  const onPaginationChanged = () => {
    console.log("onPaginationChanged");
    // console.log(gridApi,"gridApi");
    // if (gridApi) {
    //     gridApi!.exportDataAsExcel();
    //   }
  };

  const clearFilters = () => {
    if (gridApi) {
      gridApi.setFilterModel(null);
    }
  };

  const onSelectionChanged = (event:any) =>{
    setselectedRows(event.api.getSelectedRows().length);
    setselectedRowsData(event.api.getSelectedRows());
  }

  const hasSelectedRows = () => {
    if (selectedRows === 0) {
      setFeedbackTitle("Error")
      setFeedbackText("No rows have been selected.");
      onOpen();
      return false;
    }
    return true;
  }

  const deleteSelectedRows = () => {

    if (!hasSelectedRows()) {
      return;
    }

    deleteProgramApplications(selectedRowsData)
    .then((deletedRows: any) => {
      setFeedbackTitle("Deletion Successful")
      setFeedbackText(deletedRows.length + " row(s) have been deleted.");
      onOpen();
      fetchProgramApplications(pathname)
      .then((data:any) => {
        setRowData(data.rowData || []);
      });
    }).catch(() => {
      setFeedbackTitle("Deletion Error")
      setFeedbackText("An error has occured while trying to delete the specified rows. Please reach out for assistance if the issue persists.");
      onOpen();
    })
  }

  const changeCohorts = (cohort: string) => {

    if (!hasSelectedRows()) {
      return;
    }

    updateCohorts(selectedRowsData, cohort)
    .then((changedRows: any) => {
      setFeedbackTitle("Cohorts Successfully Changed")
      setFeedbackText(changedRows.length + " row(s) have been modified.");
      onOpen();
      fetchProgramApplications(pathname)
      .then((data:any) => {
        setRowData(data.rowData || []);
      });
    }).catch(() => {
      setFeedbackTitle("Cohort Change Error")
      setFeedbackText("An error has occured while trying to modify the specified rows. Please reach out for assistance if the issue persists.");
      onOpen();
    })
  }

  return (
    <div className="ag-theme-alpine grid-container">
      <div id="top-subnavigation" className="flex  align-middle mb-4 text-lg text-[#4b5563] items-center">
      <TopSubNavigation
          fetchApps={fetchProgramApplications}
          clearFilters={clearFilters}
          selectedRows={selectedRows}
          selectedRowsData={selectedRowsData}
          gridApi={gridApi}
          pathname={pathname}
          deleteSelectedRows={deleteSelectedRows}
          setRowData={setRowData}
          changeCohorts={changeCohorts}
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
};