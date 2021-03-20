import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PERSON, UserServiceService } from '../user-service.service';
import { debounceTime } from 'rxjs/operators';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit, OnDestroy {
  addPersonFrmGrp: FormGroup;
  formStatus$: Subscription;
  editFlag = false;
  editData;

  constructor(private dbService: NgxIndexedDBService, private fb: FormBuilder,
    private userService: UserServiceService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.setForm();
    this.formStatus$ = this.addPersonFrmGrp.statusChanges.pipe(debounceTime(3000)).subscribe(res => {
      console.log(res)
      if (res === 'VALID') {
        this.submit();
      }
    })
    const data = this.route.snapshot.queryParams.data;
    if (data) {
      this.editData = JSON.parse(data);
      this.editFlag = true;
      console.log(this.editData)
      const {firstName, lastName, email, id } = this.editData;
      this.addPersonFrmGrp.patchValue({ firstName, lastName, email, id })
    }
  }

  ngOnDestroy() {
    this.formStatus$.unsubscribe()
  }

  setForm() {
    this.addPersonFrmGrp = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      id: ['']
    })
  }

  get f() { return this.addPersonFrmGrp.controls; }

  submit() {
    if (!this.addPersonFrmGrp.valid) {
      return console.log('invalidForm', this.f);
    }
    const obj = this.addPersonFrmGrp.getRawValue();
    if (this.editFlag) {
      // edit logic
      this.editPerson(obj);
    } else {
      // add logic
      delete obj.id;
      this.addPerson(obj);
    }
  }

  addPerson(obj: PERSON) {
    this.dbService
  .add('person', {
    firstName: obj.firstName,
    lastName: obj.lastName,
    email: obj.email,
  })
  .subscribe((key) => {
    console.log('key: ', key);
    this.userService.openSnackBar('Person added successfully');
    this.router.navigate(['../']);
  });
  }

  editPerson(obj: PERSON) {
    this.dbService
  .update('person', {
    id: obj.id,
    firstName: obj.firstName,
    lastName: obj.lastName,
    email: obj.email,
  })
  .subscribe((storeData) => {
    console.log('personData: ', storeData);
    this.userService.openSnackBar('Person edited successfully');
    this.router.navigate(['../']);
  });
  }

}
