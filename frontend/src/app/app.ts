import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar';
import { FooterComponent } from './layout/footer/footer';
import { PreloaderComponent } from './components/preloader/preloader';
import { CursorComponent } from './components/cursor/cursor';
import { WhatsappFabComponent } from './components/whatsapp-fab/whatsapp-fab';
import { MotionService } from './services/motion.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, PreloaderComponent, CursorComponent, WhatsappFabComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  private motion = inject(MotionService);

  ngOnInit(): void {
    this.motion.init();
  }
}
