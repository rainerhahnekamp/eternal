import { Component } from '@angular/core';
import { LoadingService } from '../../shared/loading.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  constructor(public loadingService: LoadingService) {}
}
