import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalsService {


  isAllSelected(selection:any, dataSource:any) {
    const numSelected = selection.selected.length;
    const numRows = dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(selection:any, dataSource:any) {
    this.isAllSelected(selection, dataSource)
    ? selection.clear()
    : dataSource.data.forEach((row:any) => selection.select(row));
  }

  filter() {
    console.log('filtering ....');
  }
  
  sort() {
    console.log('sorting ....');
  }

  save() {
    console.log('Saving....');
  }
}
