import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as uuid from 'uuid';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  friends = [];
  friendForm;

  constructor(  
    private formBuilder: FormBuilder
  ) {
    this.friendForm = this.formBuilder.group({
      name: ''
    })
  }

  onSubmitFriendForm(friendData) {
    const friend = {
      id: uuid(),
      name: friendData.name
    }
    this.friends.push(friend)
  }

  ngOnInit() {
  }

}
