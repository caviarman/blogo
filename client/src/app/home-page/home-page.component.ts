import { Component, OnInit } from '@angular/core';
import { PostService } from '../shared/post.service';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';

import { Post } from '../shared/interfaces';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  posts$: Observable<Post[]>;
  // post$: Observable<Post[]>;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(
    private postService: PostService,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit() {
    this.posts$ = this.postService.getPosts();
   
   // this.posts$ = this.postService.getAll();
  }
  checkWidth() {
    return window.innerWidth > 600 ? 2 : 1;
  }
  // setPost(post: Post) {
  
  //   this.postService.setPost(post).subscribe(res => {
  //     console.log('rrrrrrr = ', res);
  //   });
  // }

}
