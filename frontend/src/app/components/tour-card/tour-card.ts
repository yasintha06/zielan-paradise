import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Tour } from '../../services/tour.service';
import { imageUrl } from '../../utils/image';
import { ParallaxDirective } from '../../directives/parallax';

/** Editorial tour card shared by the home, round tours and day tours pages. */
@Component({
  selector: 'app-tour-card',
  standalone: true,
  imports: [RouterLink, ParallaxDirective],
  templateUrl: './tour-card.html',
  styleUrl: './tour-card.css',
})
export class TourCardComponent {
  @Input({ required: true }) tour!: Tour;
  @Input() index = 0;

  get image(): string {
    return imageUrl(this.tour.image);
  }

  get summary(): string {
    return this.tour.description || (this.tour.targetAudience ? `Ideal for ${lower(this.tour.targetAudience)}.` : '');
  }

  get stops(): string[] {
    return (this.tour.route ?? '').split('→').map((s) => s.trim()).filter(Boolean);
  }
}

function lower(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}
