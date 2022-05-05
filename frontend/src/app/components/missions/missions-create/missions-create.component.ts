import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MissionService } from "src/app/services/mission.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-missions-create",
  templateUrl: "./missions-create.component.html"
})
export class MissionsCreateComponent {
  missionForm: FormGroup;

  constructor(
    private missionService: MissionService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.missionForm = this.formBuilder.group({
      name: ["", Validators.required],
      code: ["", Validators.required],
      startDate: [""],
      technologies: [""]
    });
  }

  onSubmit(formData) {
    if (this.missionForm.status === "VALID") {
      this.missionService.save(formData).subscribe();
      this.router.navigate(["/missions"]);
    }
  }
}
