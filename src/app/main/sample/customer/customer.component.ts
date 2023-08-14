import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ColumnMode, DatatableComponent, SelectionType } from "@swimlane/ngx-datatable";
import { AdminService } from "app/services/admin.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrServiceService } from "app/services/toastrservice.service";

@Component({
  selector: "app-customer",
  templateUrl: "./customer.component.html",
  styleUrls: ["./customer.component.scss"],
})
export class CustomerComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  private tempData = [];

  // public
  public contentHeader: object;
  public rows: any;
  public selected = [];
  public kitchenSinkRows: any;
  public basicSelectedOption: number = 10;
  public ColumnMode = ColumnMode;
  public expanded = {};
  public editingName = {};
  public editingStatus = {};
  public editingAge = {};
  public editingSalary = {};
  public chkBoxSelected = [];
  public SelectionType = SelectionType;
  public customerTempList = [];
  public addCustomerForm: FormGroup;
  addCustomerFormSubmit = false;

  measurementTempList = [];
  measurementList: any;
  customerDetails = {};
  customerData: any;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("tableRowDetails") tableRowDetails: any;

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Inline editing Name
   *
   * @param event
   * @param cell
   * @param rowIndex
   */
  inlineEditingUpdateName(event, cell, rowIndex) {
    this.editingName[rowIndex + "-" + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
  }

  /**
   * Inline editing Age
   *
   * @param event
   * @param cell
   * @param rowIndex
   */
  inlineEditingUpdateAge(event, cell, rowIndex) {
    this.editingAge[rowIndex + "-" + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
  }

  /**
   * Inline editing Salary
   *
   * @param event
   * @param cell
   * @param rowIndex
   */
  inlineEditingUpdateSalary(event, cell, rowIndex) {
    this.editingSalary[rowIndex + "-" + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
  }

  /**
   * Inline editing Status
   *
   * @param event
   * @param cell
   * @param rowIndex
   */
  inlineEditingUpdateStatus(event, cell, rowIndex) {
    this.editingStatus[rowIndex + "-" + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
  }

  /**
   * Search (filter)
   *
   * @param event
   */
  filterUpdate(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempData.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.kitchenSinkRows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  /**
   * Row Details Toggle
   *
   * @param row
   */
  rowDetailsToggleExpand(row) {
    this.tableRowDetails.rowDetail.toggleExpandRow(row);
  }

  /**
   * For ref only, log selected values
   *
   * @param selected
   */
  onSelect({ selected }) {

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  /**
   * For ref only, log activate events
   *
   * @param selected
   */
  onActivate(event) {
  }

  /**
   * Custom Chkbox On Select
   *
   * @param { selected }
   */
  customChkboxOnSelect({ selected }) {
    this.chkBoxSelected.splice(0, this.chkBoxSelected.length);
    this.chkBoxSelected.push(...selected);
  }

  modalOpen(modalBasic, size) {
    this.modalService.open(modalBasic, {
      centered: true,
      backdrop: "static",
      keyboard: true,
      size: size,
    });
  }

  /**
   * Constructor
   *
   */
  constructor(private adminService: AdminService, private modalService: NgbModal, private fb: FormBuilder, private toster: ToastrServiceService) {
    this._unsubscribeAll = new Subject();
    this.addCustomerForm = this.fb.group({
      name: ["", Validators.required],
      mail: ["", [Validators.required, Validators.email]],
      contact: ["", [Validators.required, Validators.minLength(10)]],
      altContact: ["", Validators.minLength(10)],
    });
  }

  get addCustomerFormControls() {
    return this.addCustomerForm.controls;
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    // this._datatablesService.onDatatablessChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
    //   this.rows = response;
    //   this.tempData = this.rows;
    //   this.kitchenSinkRows = this.rows;
    // });

    this.getAllCustomer();

    // content header
    this.contentHeader = {
      headerTitle: "Customers",
      actionButton: true,
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Home",
            isLink: true,
            link: "/",
          },
          {
            name: "Customers",
            isLink: false,
          },
        ],
      },
    };
  }

  getAllCustomer() {
    this.adminService.getAllCustomerList().subscribe((data: any) => {
      if (!data.status) {
        return;
      }
      this.rows = data.items;
      this.tempData = this.rows;
      this.kitchenSinkRows = this.rows;
    });
  }

  submitAddCustomerForm(isAdd: Boolean) {
    this.addCustomerFormSubmit = true;
    if (this.addCustomerForm.invalid) {
      return;
    }
    this.addCustomerFormSubmit = false;
    if (isAdd) {
      this.addCustomer(this.addCustomerForm.value);
    } else {
      this.updateCustomer(this.customerData.customerId, this.addCustomerForm.value);
    }
  }

  addCustomer(customerData: any) {
    this.adminService.addCustomer(customerData).subscribe((data: any) => {
      if (!data.status) {
        this.toster.showError(data.message, "Error");
        return;
      }
      this.toster.showSuccess(data.message, "success");
      this.modalService.dismissAll();
      this.addCustomerForm.reset();
      this.getAllCustomer();
    });
  }

  updateCustomer(customerId: any, customerData: any) {
    this.adminService.editCustomer(customerId, customerData).subscribe((data: any) => {
      if (!data.status) {
        this.toster.showError(data.message, "Error");
        return;
      }
      this.toster.showSuccess(data.message, "success");
      this.modalService.dismissAll();
      this.addCustomerForm.reset();
      this.getAllCustomer();
    });
  }

  removeCustomer(customerId: any) {
    this.adminService.deleteCustomer(customerId).subscribe((data: any) => {
      if (!data.status) {
        this.toster.showError(data.message, "Error");
        return;
      }
      this.toster.showSuccess(data.message, "success");
      this.modalService.dismissAll();
      this.getAllCustomer();
    });
  }

  getCustomerMeasurement(customerId: any) {
    this.adminService.getAllCustomerMeasurement(customerId).subscribe((data: any) => {
      if (!data.status) {
        return;
      }
      this.measurementList = data.items;
      this.measurementTempList = this.measurementList;
    });
  }

  setCustomer(row: any, loadMeasurement: Boolean) {
    this.customerData = row;
    this.customerDetails = this.customerData;
    if (loadMeasurement) {
      this.getCustomerMeasurement(this.customerData.customerId);
      return;
    }
    this.addCustomerForm.patchValue({
      name: this.customerData.name,
      mail: this.customerData.mail,
      contact: this.customerData.contact,
      altContact: this.customerData.altContact,
    });
  }
}
