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
  public selectMulti = [
    {
      id: "5a15b13c36e7a7f00cf0d7cb",
      index: 2,
      isActive: true,
      picture: "http://placehold.it/32x32",
      age: 23,
      name: "Karyn Wright",
      gender: "female",
      company: "ZOLAR",
      email: "karynwright@zolar.com",
      phone: "+1 (851) 583-2547",
    },
    {
      id: "5a15b13c2340978ec3d2c0ea",
      index: 3,
      isActive: false,
      picture: "http://placehold.it/32x32",
      age: 35,
      name: "Rochelle Estes",
      disabled: true,
      gender: "female",
      company: "EXTRAWEAR",
      email: "rochelleestes@extrawear.com",
      phone: "+1 (849) 408-2029",
    },
    {
      id: "5a15b13c663ea0af9ad0dae8",
      index: 4,
      isActive: false,
      picture: "http://placehold.it/32x32",
      age: 25,
      name: "Mendoza Ruiz",
      gender: "male",
      company: "ZYTRAX",
      email: "mendozaruiz@zytrax.com",
      phone: "+1 (904) 536-2020",
    },
    {
      id: "5a15b13cc9eeb36511d65acf",
      index: 5,
      isActive: false,
      picture: "http://placehold.it/32x32",
      age: 39,
      name: "Rosales Russell",
      gender: "male",
      company: "ELEMANTRA",
      email: "rosalesrussell@elemantra.com",
      phone: "+1 (868) 473-3073",
    },
    {
      id: "5a15b13c728cd3f43cc0fe8a",
      index: 6,
      isActive: true,
      picture: "http://placehold.it/32x32",
      age: 32,
      name: "Marquez Nolan",
      gender: "male",
      company: "MIRACLIS",
      disabled: true,
      email: "marqueznolan@miraclis.com",
      phone: "+1 (853) 571-3921",
    },
    {
      id: "5a15b13ca51b0aaf8a99c05a",
      index: 7,
      isActive: false,
      picture: "http://placehold.it/32x32",
      age: 28,
      name: "Franklin James",
      gender: "male",
      company: "CAXT",
      email: "franklinjames@caxt.com",
      phone: "+1 (868) 539-2984",
    },
    {
      id: "5a15b13cc3b9381ffcb1d6f7",
      index: 8,
      isActive: false,
      picture: "http://placehold.it/32x32",
      age: 24,
      name: "Elsa Bradley",
      gender: "female",
      company: "MATRIXITY",
      email: "elsabradley@matrixity.com",
      phone: "+1 (994) 583-3850",
    },
    {
      id: "5a15b13ce58cb6ff62c65164",
      index: 9,
      isActive: true,
      picture: "http://placehold.it/32x32",
      age: 40,
      name: "Pearson Thompson",
      gender: "male",
      company: "EZENT",
      email: "pearsonthompson@ezent.com",
      phone: "+1 (917) 537-2178",
    },
    {
      id: "5a15b13c90b95eb68010c86e",
      index: 10,
      isActive: true,
      picture: "http://placehold.it/32x32",
      age: 32,
      name: "Ina Pugh",
      gender: "female",
      company: "MANTRIX",
      email: "inapugh@mantrix.com",
      phone: "+1 (917) 450-2372",
    },
    {
      id: "5a15b13c2b1746e12788711f",
      index: 11,
      isActive: true,
      picture: "http://placehold.it/32x32",
      age: 25,
      name: "Nguyen Elliott",
      gender: "male",
      company: "PORTALINE",
      email: "nguyenelliott@portaline.com",
      phone: "+1 (905) 491-3377",
    },
    {
      id: "5a15b13c605403381eec5019",
      index: 12,
      isActive: true,
      picture: "http://placehold.it/32x32",
      age: 31,
      name: "Mills Barnett",
      gender: "male",
      company: "FARMEX",
      email: "millsbarnett@farmex.com",
      phone: "+1 (882) 462-3986",
    },
    {
      id: "5a15b13c67e2e6d1a3cd6ca5",
      index: 13,
      isActive: true,
      picture: "http://placehold.it/32x32",
      age: 36,
      name: "Margaret Reynolds",
      gender: "female",
      company: "ROOFORIA",
      email: "margaretreynolds@rooforia.com",
      phone: "+1 (935) 435-2345",
    },
    {
      id: "5a15b13c947c836d177aa85c",
      index: 14,
      isActive: false,
      picture: "http://placehold.it/32x32",
      age: 29,
      name: "Yvette Navarro",
      gender: "female",
      company: "KINETICA",
      email: "yvettenavarro@kinetica.com",
      phone: "+1 (807) 485-3824",
    },
    {
      id: "5a15b13c5dbbe61245c1fb73",
      index: 15,
      isActive: false,
      picture: "http://placehold.it/32x32",
      age: 20,
      name: "Elisa Guzman",
      gender: "female",
      company: "KAGE",
      email: "elisaguzman@kage.com",
      phone: "+1 (868) 594-2919",
    },
    {
      id: "5a15b13c38fd49fefea8db80",
      index: 16,
      isActive: false,
      picture: "http://placehold.it/32x32",
      age: 33,
      name: "Jodie Bowman",
      gender: "female",
      company: "EMTRAC",
      email: "jodiebowman@emtrac.com",
      phone: "+1 (891) 565-2560",
    },
    {
      id: "5a15b13c9680913c470eb8fd",
      index: 17,
      isActive: false,
      picture: "http://placehold.it/32x32",
      age: 24,
      name: "Diann Booker",
      gender: "female",
      company: "LYRIA",
      email: "diannbooker@lyria.com",
      phone: "+1 (830) 555-3209",
    },
  ];

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
    // measurement form builder
    this.measurementConfigForm = this.fb.group({
      name: ["", Validators.required],
      isUnit: [false, Validators.required],
      unit: [{ value: "", disabled: true }, Validators.required],
    });

    // dress form builder
    this.dressForm = this.fb.group({
      name: ["", Validators.required],
      configIdList: this.fb.array([], Validators.required),
      configList: this.fb.array([]),
      price: ["", Validators.required],
    });
  }

  // measurement form controller
  get mControls() {
    return this.measurementConfigForm.controls;
  }

  // dress form controller
  get DControls() {
    return this.dressForm.controls;
  }

  modalOpen(modalBasic, row) {
    this.configId = row.configId;
    this.modalService
      .open(modalBasic, {
        centered: true,
        backdrop: "static",
        keyboard: true,
        size: "sm",
      })
      .dismissed.subscribe(() => this.measurementConfigForm.reset());
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
    
    this.dressForm.patchValue({
      name: dressData.name,
      price: dressData.price,
    });
    console.log(this.dressForm.value);
    this.modalService
      .open(modalBasic, {
        centered: true,
        backdrop: "static",
        keyboard: true,
        size: "sm",
      })
      .dismissed.subscribe(() => this.dressForm.reset());

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

  removeMeasurementConfig(configId: any) {
    this.adminService.deleteMeasurementConfig(configId).subscribe((data: any) => {
      if (!data.status) {
        this.toster.showError(data.message, "Error");
        return;
      }
      this.toster.showSuccess(data.message, "success");
      this.modalService.dismissAll();
      this.getMeasurementConfig();
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

  removeDress(dressId: any) {
    this.adminService.deleteDress(dressId).subscribe((data: any) => {
      if (!data.status) {
        this.toster.showError(data.message, "Error");
        return;
      }
      this.toster.showSuccess(data.message, "success");
      this.modalService.dismissAll();
      this.getDress();
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
    console.log( this.idList);
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
      this.dressForm.reset();
      this.getDress();
    });
  }

  updateDress() {
    this.DSubmitted = true;
    const configIdListFormArray = this.dressForm.get("configIdList") as FormArray;
    configIdListFormArray.clear();
    this.nameAndIdList.forEach((data) => configIdListFormArray.push(this.fb.control(data.configId)));
    if (this.dressForm.invalid) {
      return;
    }
    const reqBody = {
      name: this.dressForm.value.name,
      configIdList: this.dressForm.value.configIdList,
    };
    this.DSubmitted = false;
    this.adminService.editDress(this.dressDetails.dressId, reqBody).subscribe((data: any) => {
      if (!data.status) {
        this.toster.showError(data.message, "Error");
        return;
      }
      this.toster.showSuccess(data.message, "success");
      this.modalService.dismissAll();
      this.dressForm.reset();
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
