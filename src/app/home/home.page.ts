import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { ScrollDetail } from '@ionic/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;
  loading = false;
  posts = [];
  page = 1;
  trending = [];
  showToolbar = false;
  slideOpts = {
    autoPlay: true,
    autoplay: {
      delay: 2000,
    },
    loop: true,
    autoHeight: true,
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loading = true;
    this.getData();
  }

  getData(event?) {
    this.api.get(`posts?_embed&page=${this.page}`).subscribe(data => {
      this.loading = false;
      data.forEach((post, i) => {
        const { id, title: { rendered: title }, _embedded, date } = post;
        const { sizes } = _embedded['wp:featuredmedia'][0].media_details;
        const postData = {
          id,
          title,
          date,
          author: _embedded.author[0].name,
        };
        if (i < 3) {
          const { source_url: img } = sizes.medium_large;
          this.trending.push({ ...postData, img });
        } else {
          const { source_url: img } = sizes['td_100x70'];
          this.posts.push({ ...postData, img });
        }
      });
      this.posts.splice(0, 1);
      if (event) {
        event.target.complete();
      }
    }, () => this.loading = false);
  }

  doRefresh(event) {
    this.page = 1;
    this.getData(event);
  }

  loadMoreData(event) {
    this.page += 1;
    this.api.get(`posts?_embed&page=${this.page}`).subscribe(data => {
      this.loading = false;
      if (!data.length) {
        this.infiniteScroll.disabled = true;
      }
      data.forEach(post => {
        const { id, title: { rendered: title }, _embedded, date } = post;
        const { source_url } = _embedded['wp:featuredmedia'][0].media_details.sizes['td_100x70'];
        this.posts.push({
          id,
          title,
          img: source_url,
          date,
          author: _embedded.author[0].name,
        });
      });
      event.target.complete();
    }, () => event.target.complete());
  }

  onScroll($event: CustomEvent<ScrollDetail>) {
    if ($event && $event.detail && $event.detail.scrollTop) {
      const scrollTop = $event.detail.scrollTop;
      this.showToolbar = scrollTop >= 225;
    }
  }

}
