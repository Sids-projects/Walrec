// src/app/shared/shared.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  // BehaviorSubject stores the latest value and emits updates
  private screenSizeSource = new BehaviorSubject<{
    width: number;
    height: number;
  }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Observable for components to subscribe to
  screenSize$ = this.screenSizeSource.asObservable();

  constructor() {
    // Listen for window resize events and update the BehaviorSubject
    window.addEventListener('resize', this.updateScreenSize.bind(this));
  }

  private updateScreenSize() {
    this.screenSizeSource.next({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  // Optional: Get current size immediately without subscribing
  getCurrentSize() {
    return this.screenSizeSource.getValue();
  }
}
