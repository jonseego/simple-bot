import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  color = 'blue';//111

  ngOnInit() {
    chrome.storage.sync.get('color', ({ color }) => {
      this.color = color;
      this.colorize();
    });
  }

  private colorize() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id! },
        func: (color: string) => {
          document.body.style.backgroundColor = color;
        },
        args: [this.color]
      });
    });
  }
}
