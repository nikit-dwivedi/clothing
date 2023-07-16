import { Component, OnInit, ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ColumnMode, DatatableComponent, SelectionType } from "@swimlane/ngx-datatable";
import { repeaterAnimation } from "./order.animation";
import { AdminService } from "app/services/admin.service";
import { Subject } from "rxjs";
import Stepper from "bs-stepper";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.scss"],
  animations: [repeaterAnimation],
})
export class OrderComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  private tempData = [];

  // public
  public isDisable = { 0: false };
  public contentHeader: object;
  public rows: any;
  public selected = [];
  public kitchenSinkRows: any;
  public basicSelectedOption: number = 10;
  public ColumnMode = ColumnMode;
  public expanded = {};
  public SelectionType = SelectionType;

  public customerTempList = [];
  public customerDummyList = [];
  public customerData: any = {};
  public customerSelected = false;
  public dressList = [];
  customerList: any;

  public customerMeasurementList = { 0: [] };

  accountDetailsForm: FormGroup;
  orderForm: FormGroup;
  paymentForm: FormGroup;

  public accountDetailsFormSubmit = false;
  public measurementFormSubmit = false;
  public paymentFormSubmit = false;

  // private
  private horizontalWizardStepper: Stepper;
  private bsStepper;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("tableRowDetails") tableRowDetails: any;

  // -------------------------------------------------stepper------------------------------------------------- //

  /**
   * Horizontal Wizard Stepper Next
   *
   * @param data
   */
  horizontalWizardStepperNext(data, type) {
    switch (type) {
      case "account":
        this.accountDetailsFormSubmit = true;
        break;
      case "measurement":
        this.measurementFormSubmit = true;
        break;
      case "payment":
        // this.paymentFormSubmit = true;
        return;
        break;
    }
    if (!data.invalid) {
      switch (type) {
        case "account":
          this.accountDetailsFormSubmit = false;
          if (this.dressCollection.length === 0) {
            this.getDressList();
            this.addDressToOrder();
          }
          break;
        case "measurement":
          this.measurementFormSubmit = false;
          break;
        case "payment":
          this.paymentFormSubmit = false;
          break;
      }
      this.horizontalWizardStepper.next();
    }
  }
  /**
   * Horizontal Wizard Stepper Previous
   */
  horizontalWizardStepperPrevious() {
    this.horizontalWizardStepper.previous();
  }

  // -------------------------------------------------Modal------------------------------------------------- //

  /**
   * order modal
   */
  modalOpen(modalBasic) {
    this.modalService.open(modalBasic, {
      centered: true,
      backdrop: "static",
      keyboard: true,
      size: "xl",
    });

    this.horizontalWizardStepper = new Stepper(document.querySelector("#stepper1"), {});
    this.bsStepper = document.querySelectorAll(".bs-stepper");
  }

  /**
   * customer modal
   */
  customerListModalOpen(modalBasic) {
    this.customerSelected = false;
    this.modalService.open(modalBasic, {
      centered: true,
      backdrop: "static",
      keyboard: true,
      size: "lg",
      beforeDismiss: () => {
        this.patchCustomerDetails();
        return true;
      },
    });
  }

  // -------------------------------------------------table------------------------------------------------- //

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

  // -------------------------------------------------Constructor------------------------------------------------- //

  /**
   * Constructor
   *
   */

  constructor(private adminService: AdminService, private modalService: NgbModal, private fb: FormBuilder) {
    this.accountDetailsForm = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      contact: ["", [Validators.required, Validators.minLength(10)]],
      alternateContact: ["", Validators.minLength(10)],
    });

    this.orderForm = this.fb.group({
      dressCollection: this.fb.array([], Validators.required),
    });

    this.paymentForm = this.fb.group({
      paymentStatus: ["pending", Validators.required],
      paymentType: ["cash", Validators.required],
    });

    // -------------------------------------------------Forms------------------------------------------------- //

    // Getter for dress details form array
  }

  get accountDetailsControls() {
    return this.accountDetailsForm.controls;
  }

  get paymentControls() {
    return this.paymentForm.controls;
  }

  get orderControls() {
    return this.orderForm.controls;
  }

  get dressCollection(): FormArray {
    return this.orderForm.get("dressCollection") as FormArray;
  }

  get dressCollectionControl() {
    return this.dressCollection.controls;
  }

  getIndividualDress(index: number): FormGroup {
    return this.dressCollection.at(index) as FormGroup;
  }

  getIndividualDressController(index: number) {
    return this.getIndividualDress(index).controls;
  }

  getConfigDetails(index: number): FormArray {
    return this.getIndividualDress(index).get("configList") as FormArray;
  }
  getConfigControls(index: number) {
    return this.getConfigDetails(index).controls;
  }
  getConfigDetailsController(index: number) {
    return this.getConfigDetails(index).controls;
  }

  addDressToOrder() {
    if (this.dressCollection.length === 0) {
      this.dressCollection.push(this.createMeasurementForm());
      return;
    }
    if (this.dressCollection.status === "INVALID") {
      return;
    }
    this.dressCollection.push(this.createMeasurementForm());
  }

  removeDressFromOrder(index: any) {
    if (this.dressCollection.length > 1) {
      this.dressCollection.removeAt(index);
      this.customerMeasurementList[index] = [];
    }
  }

  // Add a new dress detail input field
  addDressDetail(configId: string, name: string, dressIndex: any) {
    this.getConfigDetails(dressIndex).push(this.createDressDetail(configId, name));
  }

  // Remove a dress detail input field
  removeDressDetail(index: number, dressIndex: any) {
    this.getConfigDetails(dressIndex).removeAt(index);
  }

  // Create a new dress detail form group
  createMeasurementForm(): FormGroup {
    return this.fb.group({
      dressId: ["", Validators.required],
      dressName: ["", Validators.required],
      measurementId: [""],
      configList: this.fb.array([], Validators.required),
      description: [""],
      tag: ["", Validators.required],
    });
  }

  // Create a new dress detail form group
  createDressDetail(configId: string, name: string): FormGroup {
    return this.fb.group({
      configId: [configId],
      name: [name],
      value: ["", Validators.required],
    });
  }

  // Handle dress selection
  onDressChange(selectedDress: any, index: any) {
    // Clear existing dress details
    this.getIndividualDress(index).controls.dressName.setValue(selectedDress.name);
    while (this.getConfigDetails(index).length !== 0) {
      this.getConfigDetails(index).removeAt(0);
    }
    this.isDisable[index] = false;
    // // Add dress details based on configIdList
    this.getCustomerMeasurement(this.customerData.customerId, selectedDress?.dressId, index);
    if (selectedDress && selectedDress.configIdList) {
      selectedDress.configIdList.forEach((config: any) => {
        this.addDressDetail(config.configId, config.name, index);
      });
    }
  }

  onCustomerMeasurementSelect(selectedMeasurement: any, index: any) {
    this.patchMeasurementDetails(selectedMeasurement, index);
  }

  ngOnInit(): void {
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
            name: "Order",
            isLink: false,
          },
        ],
      },
    };
  }

  test(i: any) {}

  getAllCustomer() {
    this.adminService.getAllCustomerList().subscribe((data: any) => {
      if (!data.status) {
        return;
      }
      this.customerDummyList = data.items;
      this.customerTempList = this.customerDummyList;
    });
  }

  filterCustomer(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.customerDummyList.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || d.mail.toLowerCase().indexOf(val) !== -1 || d.contact.toLowerCase().indexOf(val) !== -1 || d.altContact?.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.customerTempList = temp;
  }

  selectCustomer(customer: any) {
    this.customerData = customer;
    this.customerSelected = true;
    this.patchCustomerDetails();
  }

  patchCustomerDetails() {
    if (this.customerSelected) {
      this.accountDetailsForm.patchValue({
        name: this.customerData.name,
        email: this.customerData.mail,
        contact: this.customerData.contact,
        alternateContact: this.customerData.alternateContact,
      });
      this.accountDetailsForm.get("name").disable();
      this.accountDetailsForm.get("email").disable();
      this.accountDetailsForm.get("contact").disable();
      this.accountDetailsForm.get("alternateContact").disable();

      // Disable the text field
    } else {
      this.accountDetailsForm.get("name").enable();
      this.accountDetailsForm.get("email").enable();
      this.accountDetailsForm.get("contact").enable();
      this.accountDetailsForm.get("alternateContact").enable();
    }
  }

  patchMeasurementDetails(selectedMeasurement: any, index: any) {
    let patchMap;
    if (selectedMeasurement) {
      this.getIndividualDressController(index).tag.setValue(selectedMeasurement.tag)
      this.getIndividualDressController(index).description.setValue(selectedMeasurement.description)
      patchMap = new Map(
        selectedMeasurement.configList.map((config: any) => {
          return [config.configId.configId, config.value];
        })
      );
    }

    this.getConfigDetails(index).controls.forEach((measurementForm: FormGroup) => {
      const id = measurementForm.get("configId").value;

      if (patchMap?.get(id)) {
        measurementForm.patchValue({
          value: patchMap.get(id),
        });
        // measurementForm.get("value").setValue(patchMap.get(id));
        this.isDisable[index] = true;
        // console.log("=======",this.measurementForm.get("configList").value);
        // measurementForm.get("value").disable({ emitEvent: true });
      } else {
        this.isDisable[index] = false;
        // measurementForm.get("value").enable();
      }
    });
  }

  getDressList() {
    this.adminService.getAllDressList().subscribe((data) => {
      if (!data.status) {
        this.dressList = [];
        return;
      }
      this.dressList = data.items;
    });
  }

  getCustomerMeasurement(customerId: any, dressId: any, index: any) {
    this.adminService.getCustomerMeasurementList(customerId, dressId).subscribe((data) => {
      if (!data.status) {
        this.customerMeasurementList[index] = [];
        return;
      }
      this.customerMeasurementList[index] = data.items;
      this.customerMeasurementList[index + 1] = [];
    });
  }

  addOrder() {
    // this.orderForm.value
    let userDetail = this.customerSelected ? this.customerData : this.accountDetailsForm.value;
    let orderList = this.orderForm.value;
    let paymentDetail = this.paymentForm.value;
    console.log(orderList, "=======================", userDetail, "=======================", paymentDetail);
    //  let a =  this.dressCollectionControl.forEach((dress) => {
    //   return dress.value
    //   });
  }
}
