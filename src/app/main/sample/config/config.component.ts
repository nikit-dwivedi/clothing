import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { AdminService } from "app/services/admin.service";
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ToastrServiceService } from "app/services/toastrservice.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectConfig } from "@ng-select/ng-select";

@Component({
  selector: "app-config",
  templateUrl: "./config.component.html",
  styleUrls: ["./config.component.scss"],
})
export class ConfigComponent implements OnInit {
  @ViewChild("ng-value") myDiv: ElementRef;
  public measurementTempList = [];
  public mCSubmitted = false;
  measurementConfigList: any;
  measurementConfigForm: FormGroup;

  public selectMultiSelected = [{ name: "Karyn Wright" }];

  public configId = "";

  public dressTempList = [];
  public DSubmitted = false;
  public selectedMeasurement = [];
  public tempDressDetails = {};
  dressDetails: any;
  dressList: any;
  dressForm: FormGroup;
  // Select Custom header footer template
  public selectCustomHeaderFooter = [];
  public selectCustomHeaderFooterSelected = [];
  public idList = [];
  public nameAndIdList = [];

  constructor(private adminService: AdminService, private fb: FormBuilder, private toster: ToastrServiceService, private modalService: NgbModal, private selectConfig: NgSelectConfig) {
    this.measurementConfigForm = this.fb.group({
      name: ["", Validators.required],
      isUnit: [false, Validators.required],
      unit: [{ value: "", disabled: true }, Validators.required],
    });

    this.dressForm = this.fb.group({
      name: ["", Validators.required],
      configIdList: this.fb.array([], Validators.required),
      configList: this.fb.array([]),
      price: ["", Validators.required],
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

  dressModalOpen(modalBasic, dressData) {
    // this.configId = row.configId;
    this.dressDetails = dressData;
    this.tempDressDetails = this.dressDetails;
    this.nameAndIdList = dressData.configIdList.map((element: any) => {
      const { name, configId, isUnit, unit } = element;
      return { name, configId, isUnit, unit };
    });

    this.idList = dressData.configIdList.map((element: any) => {
      return element.configId;
    });
    this.selectConfig;
    const configIdListFormArray = this.dressForm.get("configIdList") as FormArray;
    const configListFormArray = this.dressForm.get("configList") as FormArray;
    configIdListFormArray.clear();
    configListFormArray.clear();
    this.idList.forEach((id) => configIdListFormArray.push(this.fb.control(id)));
    this.nameAndIdList.forEach((data) => configListFormArray.push(this.fb.control({ configId: data.configId, name: data.name, isUnit: data.isUnit, uit: data.unit })));

    this.dressForm.patchValue({
      name: dressData.name,
      price: dressData.price,
    });
    console.log(this.dressForm.value);
    this.modalService.open(modalBasic, {
      centered: true,
      backdrop: "static",
      keyboard: true,
      size: "sm",
    });
    let a = document.getElementById("dressUpdate");
    // console.log(a.children[0].children[0].appendChild(``));
  }

  compareFn(item1) {
    console.log("============", item1);

    // This function will compare the configId property of each item
    // Modify it according to your data structure if needed
    // return item1 && item2 ? item1.configId === item2.configId : item1 === item2;
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
    console.log(select);

    // const selectedOptions = Array.from(select.value)
    this.nameAndIdList = select.map((element: any) => {
      const { name, configId } = element;
      return { name, configId };
    });
    this.idList = select.map((element: any) => {
      return element.configId;
    });

    // this.selectedMeasurement = configIdListFormArray.getRawValue();
    // selectedOptions.forEach((optionValue) => {
    //   this.selectedMeasurement.includes(optionValue) ? configIdListFormArray.removeAt(this.selectedMeasurement.findIndex((id) => id == optionValue)) : configIdListFormArray.push(this.fb.control(optionValue));
    // });
  }

  onConfigIdListChangeUpdate(select: any) {
    if (!select[1]) {
      select = [...select, ...this.nameAndIdList];
    }
    // console.log(this.selectConfig.addTagText);

    this.nameAndIdList = select.map((element: any) => {
      const { name, configId, isUnit, unit } = element;
      return { name, configId, isUnit, unit };
    });
    this.idList = select.map((element: any) => {
      return element.configId;
    });
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
      console.log(this.dressForm);
      return;
    }
    const reqBody = {
      name: this.dressForm.value.name,
      configIdList: this.dressForm.value.configIdList,
      price: this.dressForm.value.price,
    };
    this.DSubmitted = false;
    this.adminService.addDress(reqBody).subscribe((data: any) => {
      if (!data.status) {
        this.toster.showError(data.message, "Error");
        return;
      }
      this.toster.showSuccess(data.message, "success");
      this.dressForm.reset()
      this.getDress();
    });
  }

  updateDress() {
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
    console.log(reqBody);

    this.DSubmitted = false;
    // this.adminService.editDress(this.dressDetails.dressId, reqBody).subscribe((data: any) => {
    //   if (!data.status) {
    //     this.toster.showError(data.message, "Error");
    //     return;
    //   }
    //   this.toster.showSuccess(data.message, "success");
    //   this.modalService.dismissAll();
    //   this.dressForm.reset();
    //   this.getDress();
    // });
  }

  // setupConfigIdList() {
  //   const configIdListArray = this.dressForm.get("configIdList") as FormArray;
  //   this.measurementTempList.forEach(() => {
  //     configIdListArray.push(this.fb.control(false));
  //   });
  // }
}
