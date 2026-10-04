import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../config/site';
import { MotionService } from '../../services/motion.service';
import { MagneticDirective } from '../../directives/magnetic';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, MagneticDirective],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent {
  private motion = inject(MotionService);
  readonly site = SITE;
  readonly year = new Date().getFullYear();

  toTop(): void {
    this.motion.scrollTo(0);
  }
}
