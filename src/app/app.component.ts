import { AuthService } from './services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ingresoegresoapp';

  constructor(private authService: AuthService){
    this.authService.initAuthListener();
  }

}
