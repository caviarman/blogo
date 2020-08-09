import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Post } from '../../shared/interfaces';
import { PostService } from 'src/app/shared/post.service';
import { AlertService } from '../shared/services/alert.service';
import { environment as env} from 'src/environments/environment.prod';
import * as firebase from 'firebase/app';
import 'firebase/storage';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnInit {

  @ViewChild('uploadImage', { static: true}) uploadImage;
  @ViewChild('uploader', { static: true}) uploader;
  percentage = 0;
  form: FormGroup;
  firebaseConfig = {
    apiKey: env.apiKey,
    authDomain: env.authDomain,
    databaseURL: env.databaseURL,
    projectId: env.projectId,
    storageBucket: env.storageBucket,
    messagingSenderId: env.messagingSenderId,
    appId: env.appId
  };

  constructor(
    private postService: PostService,
    private alert: AlertService
  ) {
  }

  ngOnInit() {
    firebase.initializeApp(this.firebaseConfig);
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      text: new FormControl(null, Validators.required),
      preview: new FormControl(null, Validators.required),
      image: new FormControl(null),
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const post: Post = {
      title: this.form.value.title,
      preview: this.form.value.preview,
      text: this.form.value.text,
      createdOn: new Date(),
      updatedOn: new Date(),
      image: this.form.value.image,
      avatar: ''
    };

    this.postService.create(post).subscribe(res => {
      this.form.reset();
      this.alert.success('Пост успешно создан!');
    });
  }

  onFileAdd() {
    const file: File = this.uploadImage.nativeElement.files[0];
    const storageRef = firebase.storage().ref('postImages/' + file.name);
    const task = storageRef.put(file);
    task.on('state_changed', (snapshot) => {
      this.percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
    }, () => {}, () => {
      task.snapshot.ref.getDownloadURL().then(downloadURL => {
        console.log('downloadURL = ', downloadURL);
        if (!!downloadURL) {
          this.form.value.image = downloadURL;
          this.alert.success('Изображение загружено!');
        }
      });
    });
  }

}
