import { Component, OnInit } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { PERSON, UserServiceService } from '../user-service.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
  dataSource: any;
  dataSourceBackup: any;

  constructor(private dbService: NgxIndexedDBService, private userService: UserServiceService) { }

  ngOnInit() {
    this.getAllList();
  }

  getAllList() {
    this.dbService.getAll('person').subscribe((peoples: PERSON[]) => {
      console.log(peoples);
      this.dataSource = peoples;
      this.dataSourceBackup = peoples;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (!filterValue) {
      this.dataSource = this.dataSourceBackup;
    }
    this.dataSource = this.dataSourceBackup.filter( obj =>
      obj.firstName.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0 ||
      obj.lastName.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0 ||
      obj.email.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0
      );
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deletePerson(id: number) {
    this.dbService.delete('person', id).subscribe((allPeople) => {
      this.userService.openSnackBar(`Person: ${id} deleted successfully`);
      console.log('all people:', allPeople);
      this.dataSourceBackup = allPeople;
      this.dataSource = allPeople;
    });
  }

  clearAllEntries() {
    this.dbService.clear('person').subscribe((successDeleted) => {
      this.userService.openSnackBar('All person list cleared');
      this.getAllList()
      console.log('success? ', successDeleted);
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    // moveItemInArray(this.dataSource, event.previousIndex, event.currentIndex);
    const prevObj = this.dataSource[event.previousIndex];
    const currentObj = this.dataSource[event.currentIndex];
    this.dataSource[event.previousIndex] = currentObj;
    this.dataSource[event.currentIndex] = prevObj;
    console.log(this.dataSource)
  }

}
