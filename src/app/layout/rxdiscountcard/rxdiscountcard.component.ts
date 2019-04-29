import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rxdiscountcard',
  templateUrl: './rxdiscountcard.component.html',
  styleUrls: ['./rxdiscountcard.component.scss']
})
export class RxdiscountcardComponent implements OnInit {
  cardImagePath : string;
  memberId : string = "DDN6713";
  bin : string = "015558";
  groupId : string = "DDN6713";
  constructor() { 
    this.cardImagePath = "/assets/images/petscard.PNG"
  }

  ngOnInit() {
  }

}
