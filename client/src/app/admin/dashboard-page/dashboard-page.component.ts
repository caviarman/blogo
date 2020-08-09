import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from 'src/app/shared/post.service';
import { Post } from '../../shared/interfaces';
import { Subscription } from 'rxjs';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  pSub: Subscription;
  dSub: Subscription;
  searchPost = '';

  constructor(
    private postService: PostService,
    private alert: AlertService
  ) { }

  ngOnInit() {
    this.pSub = this.postService.getPosts().subscribe(posts => {
      this.posts = posts;
      console.log(posts);
    });
  }

  remove(id: number) {
    this.dSub = this.postService.remove(id).subscribe(res => {
      this.posts = this.posts.filter(post => post.ID !== id);
      this.alert.success('Пост успешно удален!');
    });
  }

  ngOnDestroy() {
    if (this.pSub) {
      this.pSub.unsubscribe();
    }
    if (this.dSub) {
      this.dSub.unsubscribe();
    }
  }

}
