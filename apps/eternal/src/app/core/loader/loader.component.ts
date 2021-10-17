import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingService } from '../../shared/loading.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  constructor(public loadingService: LoadingService) {}
}

@NgModule({
  imports: [CommonModule, MatProgressBarModule],
  declarations: [LoaderComponent],
  exports: [LoaderComponent]
})
export class LoaderComponentModule {}
