import { Component, OnInit } from "@angular/core";
import { AdminService } from "app/services/admin.service";
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ToastrServiceService } from "app/services/toastrservice.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-config",
  templateUrl: "./config.component.html",
  styleUrls: ["./config.component.scss"],
})
export class ConfigComponent implements OnInit {
  public measurementTempList = [];
  public mCSubmitted = false;
  measurementConfigList: any;
  measurementConfigForm: FormGroup;

  public configId = "";

  public dressTempList = [];
  public DSubmitted = false;
  public selectedMeasurement = [];
  dressList: any;
  dressForm: FormGroup;
  // Select Custom header footer template
  public selectCustomHeaderFooter = [];
  public selectCustomHeaderFooterSelected = [];
  public idList = [];

  constructor(private adminService: AdminService, private fb: FormBuilder, private toster: ToastrServiceService, private modalService: NgbModal) {
    this.measurementConfigForm = this.fb.group({
      name: ["", Validators.required],
      isUnit: [false, Validators.required],
      unit: [{ value: "", disabled: true }, Validators.required],
    });

    this.dressForm = this.fb.group({
      name: ["", Validators.required],
      configIdList: this.fb.array([], Validators.required),
    });
  }

  get mControls() {
    return this.measurementConfigForm.controls;
  }

  get DControls() {
    return this.dressForm.controls;
  }

  modalOpen(modalBasic, row) {
    this.configId = row.configId;
    this.modalService.open(modalBasic, {
      centered: true,
      backdrop: "static",
      keyboard: true,
      size: "sm",
    });
    this.measurementConfigForm.patchValue({
      name: row.name,
      isUnit: Boolean(row.isUnit),
      unit: row.unit,
    });
  }

  // -------------------lifecycle------------------- //

  ngOnInit(): void {
    this.getMeasurementConfig();
    this.disableUnitFiled();

    this.getDress();
  }

  addMeasurementConfig() {
    this.mCSubmitted = true;
    if (this.measurementConfigForm.invalid) {
      return;
    }
    const reqBody = {
      name: this.measurementConfigForm.value.name,
      unit: this.measurementConfigForm.value.unit,
      isUnit: this.measurementConfigForm.value.isUnit,
    };
    this.mCSubmitted = false;
    this.adminService.addMeasurementConfig(reqBody).subscribe((data: any) => {
      if (!data.status) {
        this.toster.showError(data.message, "Error");
        return;
      }
      this.toster.showSuccess(data.message, "success");
      this.getMeasurementConfig();
    });
  }

  updateMeasurementConfig() {
    this.mCSubmitted = true;
    if (this.measurementConfigForm.invalid) {
      return;
    }
    const reqBody = {
      name: this.measurementConfigForm.value.name,
      unit: this.measurementConfigForm.value.unit,
      isUnit: this.measurementConfigForm.value.isUnit,
    };
    this.mCSubmitted = false;
    this.adminService.editMeasurementConfig(this.configId, reqBody).subscribe((data: any) => {
      if (!data.status) {
        this.toster.showError(data.message, "Error");
        return;
      }
      this.toster.showSuccess(data.message, "success");
      this.modalService.dismissAll();
      this.measurementConfigForm.reset();
      this.getMeasurementConfig();
    });
  }

  getMeasurementConfig() {
    this.adminService.getAllMeasurementList().subscribe((data: any) => {
      if (!data.status) {
        return;
      }
      this.measurementConfigList = data.items;
      this.measurementTempList = this.measurementConfigList;
    });
  }

  disableUnitFiled() {
    this.measurementConfigForm.get("isUnit").valueChanges.subscribe((value) => {
      const unitControl = this.measurementConfigForm.get("unit");
      unitControl.setValue("");
      value ? unitControl.enable() : unitControl.disable();
    });
  }

  getDress() {
    this.adminService.getAllDressList().subscribe((data: any) => {
      if (!data.status) {
        return;
      }
      this.dressList = data.items;
      this.dressTempList = this.dressList;
    });
  }

  onConfigIdListChange(select: any) {
    // const selectedOptions = Array.from(select.value)

    this.idList = select.map((element: any) => {
      return element.configId;
    });

    // this.selectedMeasurement = configIdListFormArray.getRawValue();
    // selectedOptions.forEach((optionValue) => {
    //   this.selectedMeasurement.includes(optionValue) ? configIdListFormArray.removeAt(this.selectedMeasurement.findIndex((id) => id == optionValue)) : configIdListFormArray.push(this.fb.control(optionValue));
    // });
  }

  customHeaderFooterSelectAll() {
    this.selectCustomHeaderFooterSelected = this.selectCustomHeaderFooter.map((x) => x.name);
  }

  customHeaderFooterUnselectAll() {
    this.selectCustomHeaderFooterSelected = [];
  }

  addDress() {
    this.DSubmitted = true;
    const configIdListFormArray = this.dressForm.get("configIdList") as FormArray;
    configIdListFormArray.clear();
    this.idList.forEach((id) => configIdListFormArray.push(this.fb.control(id)));
    if (this.dressForm.invalid) {
      return;
    }
    const reqBody = {
      name: this.dressForm.value.name,
      configIdList: this.dressForm.value.configIdList,
    };
    this.DSubmitted = false;
    this.adminService.addDress(reqBody).subscribe((data: any) => {
      if (!data.status) {
        this.toster.showError(data.message, "Error");
        return;
      }
      this.toster.showSuccess(data.message, "success");
      this.getDress();
    });
  }

  // setupConfigIdList() {
  //   const configIdListArray = this.dressForm.get("configIdList") as FormArray;
  //   this.measurementTempList.forEach(() => {
  //     configIdListArray.push(this.fb.control(false));
  //   });
  // }
}
