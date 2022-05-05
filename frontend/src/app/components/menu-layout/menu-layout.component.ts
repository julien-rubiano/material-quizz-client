import { MediaMatcher } from "@angular/cdk/layout";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import * as introJs from "intro.js/intro.js";
import { AuthService } from "src/app/services/auth.service";
import { User } from "src/app/models/user.model";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-menu-layout",
  templateUrl: "./menu-layout.component.html",
  styleUrls: ["./menu-layout.component.css"]
})
export class MenuLayoutComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  isAdmin = false;
  currentUser: User;
  introJS = introJs();

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.mobileQuery = media.matchMedia("(max-width: 600px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.introJS.setOptions({
      exitOnOverlayClick: false,
      exitOnEsc: false,
      nextLabel: "Suivant",
      prevLabel: "Précédent",
      doneLabel: "Terminé",
      hidePrev: true,
      hideNext: true,
      showBullets: false,
      showProgress: true,
      showStepNumbers: false,
      steps: [
        {
          intro:
            "<h1>Bonjour</h1>Bienvenue sur Calendar ! <br><br> Nous allons faire un petit tour du produit afin de vous présenter les principales fonctionnalités."
        },
        {
          element: "#step1",
          intro: "Ici vous retrouverez l'utilisateur connecté : vous !"
        },
        {
          element: "#step2",
          intro: "Si vous souhaitez vous déconnecter, c'est par ici."
        },
        {
          element: "#step3",
          intro:
            "Par défaut, vous arrivez sur votre calendrier personnel ou <strong>Compte Rendu d'Activité (CRA)</strong>. <br><br> Les jours de congés sont grisés, pour le reste, c'est à vous de jouer !",
          position: "left"
        },
        {
          element: "#step4",
          intro:
            "Sur la droite se trouvent les missions disponibles. Il vous suffit de glisser/déposer ces missions dans les cases du calendrier. <br><br>Deux événements (missions/absences) maximum sont autorisées par jour. <br><br> Pour supprimer un événement dans le calendrier, cliquez simplement dessus (dans le calendrier).",
          position: "left"
        },
        {
          element: "#step5",
          intro:
            "En dessous des missions vous avez les absences, qui fonctionnent de la même manière.",
          position: "left"
        },
        {
          element: "#step6",
          intro:
            "Enfin vous pourrez accéder au menu en cliquant sur cette icône. <br><br>Bon à savoir : les administrateurs voient plus de choses que les autres.",
          position: "left"
        }
      ]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser.hasCompletedTutorial) {
      this.introJS.oncomplete(() => {
        this.currentUser.hasCompletedTutorial = true;
        this.authService.setCurrentUser(this.currentUser);
        this.userService.completeTutorial(this.currentUser).subscribe();
      });
      this.introJS.start();
    }
    this.authService
      .isCurrentUserAdmin()
      .subscribe(result => (this.isAdmin = result));
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  onLogout() {
    this.authService.logout();
  }
}
