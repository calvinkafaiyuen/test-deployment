import { useEffect, useCallback } from 'react';

const useGridStateHook = (gridApi: any, pathname: string) => {
  const stateName = pathname.split('/').filter(part => part !== '').join('-');
  const filterKey = `${stateName}-filter`;
  const columnKey = `${stateName}-column`;

  console.log('useGridStateHook:', { stateName, filterKey, columnKey });

  useEffect(() => {
    if (gridApi) {
      console.log('Loading state from localStorage...');
      
      const savedFilterState = localStorage.getItem(filterKey);
      if (savedFilterState) {
        console.log('Applying filter state:', savedFilterState);
        const parsedFilterState = JSON.parse(savedFilterState);
        gridApi.setFilterModel(parsedFilterState);
      }

      const savedColumnState = localStorage.getItem(columnKey);
      if (savedColumnState) {
        console.log('Applying column state:', savedColumnState);
        const parsedColumnState = JSON.parse(savedColumnState);
        gridApi.applyColumnState({ state: parsedColumnState, applyOrder: true });
      }
    }
  }, [gridApi, filterKey, columnKey]);

  const saveFilterModel = useCallback(() => {
    if (gridApi) {
      const filterModel = JSON.stringify(gridApi.getFilterModel());
      console.log('Saving filter state:', filterModel);
      localStorage.setItem(filterKey, filterModel);
    }
  }, [gridApi, filterKey]);

  const saveColumnState = useCallback(() => {
    if (gridApi) {
      const columnState = JSON.stringify(gridApi.getColumnState());
      console.log('Saving column state:', columnState);
      localStorage.setItem(columnKey, columnState);
    }
  }, [gridApi, columnKey]);

  return { saveFilterModel, saveColumnState };
};

export default useGridStateHook;
