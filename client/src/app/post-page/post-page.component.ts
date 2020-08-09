import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { PostService } from '../shared/post.service';
import { Post } from '../shared/interfaces';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit {

  post$: Observable<Post>;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) { }

  ngOnInit() {
    this.post$ = this.route.params
      .pipe(
        switchMap((params) => {
          return this.postService.getById(params.id);
        })
      );
  }

}
