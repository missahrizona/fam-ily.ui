import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  constructor() {}

  @ViewChild('earth') earth!: ElementRef;
  moving: boolean = false;
  startpoint: any = {};
  earthcenter: any = {};
  rotate = 0;
  clockwise = true;
  intervalId: any;

  ngAfterViewInit() {
    let coords = this.earth.nativeElement.getBoundingClientRect();
    this.earthcenter.x = Math.round(coords.x + coords.width / 2);
    this.earthcenter.y = Math.round(coords.y + coords.height / 2);
  }

  touchstart(evt: any) {
    this.moving = true;
    this.startpoint = {
      x: evt.touches[0].clientX - this.earthcenter.x,
      y: (evt.touches[0].clientY - this.earthcenter.y) * -1,
    };
  }
  touchmove(evt: any) {
    if (this.moving) {
      var newpoint = {
        x: evt.touches[0].clientX - this.earthcenter.x,
        y: (evt.touches[0].clientY - this.earthcenter.y) * -1,
      };

      let angle = 0;

      let theta =
        Math.atan2(this.startpoint.y, this.startpoint.x) -
        Math.atan2(newpoint.y, newpoint.x);
      angle = theta * (180 / Math.PI);

      this.startpoint = newpoint;

      this.rotate += angle;

      this.clockwise = angle > 0 ? true : false;

      this.earth.nativeElement.style.transform = `rotate(${this.rotate}deg)`;
    }
  }

  getAngle(A: any, B: any, C: any) {
    var AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
    var BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
    var AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));
    return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
  }

  plot(point: any) {
    let div = document.createElement('div');
    div.style.width = '5px';
    div.style.height = '5px';
    div.style.borderRadius = '50%';
    div.style.background = 'black';
    div.style.position = 'absolute';
    div.style.zIndex = '2';
    div.style.left = point.x + 'px';
    div.style.top = point.y + 'px';
    document.body.appendChild(div);
  }

  touchend(evt: any) {
    this.moving = false;

    this.intervalId = setInterval(() => {
      if (this.clockwise) {
        this.rotate += 2;
        this.earth.nativeElement.style.transform = `rotate(${this.rotate}deg)`;
      } else {
        this.rotate -= 2;
        this.earth.nativeElement.style.transform = `rotate(${this.rotate}deg)`;
      }
    }, 10);

    setTimeout(() => {
      clearInterval(this.intervalId);
    }, 500);
  }
}
