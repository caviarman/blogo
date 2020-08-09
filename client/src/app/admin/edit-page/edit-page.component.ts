import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PostService } from 'src/app/shared/post.service';
import { switchMap } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Post } from '../../shared/interfaces';
import { Subscription } from 'rxjs';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  post: Post;
  uSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private postsService: PostService,
    private alert: AlertService
  ) { }

  ngOnInit() {
    this.route.params.pipe(
      switchMap((params: Params) => {
        return this.postsService.getById(params.id);
      })
    ).subscribe((post: Post) => {
      this.post = post;
      this.form = new FormGroup({
        title: new FormControl(post.title, Validators.required),
        text: new FormControl(post.text, Validators.required),
        preview: new FormControl(post.preview, Validators.required)
      });
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.uSub = this.postsService.update({
      ...this.post,
      title: this.form.value.title,
      text: this.form.value.text,
      preview: this.form.value.preview
    }).subscribe(() => {
      this.alert.success('Пост успешно обновлен!');
    });
  }

  ngOnDestroy() {
    if (this.uSub) {
      this.uSub.unsubscribe();
    }
  }

}
