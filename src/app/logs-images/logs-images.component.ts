import { Component, OnInit, Input } from '@angular/core';
import { BackButtonService } from '../services/back-button.service';

@Component({
  selector: 'app-logs-images',
  templateUrl: './logs-images.component.html',
  styleUrls: ['./logs-images.component.scss'],
})
export class LogsImagesComponent implements OnInit {

  @Input() images: Array<string>

  constructor(
    private backButton: BackButtonService
  ) { }

  ngOnInit() {
    this.backButton.setPopoverBackButton();
  }

}
