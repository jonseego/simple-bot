import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  ngOnInit() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id! },
        func: () => {
          removePlaceholderContainer();
          addActionBar();

          function addActionBar() {
            const fragment = document.createDocumentFragment();
            const li = fragment
              .appendChild(createMainContainer())
              .appendChild(document.createElement("ul"))
              .appendChild(document.createElement("li"));
            li.textContent = "hello world";
  
            document.body.appendChild(fragment);
          }

          function createMainContainer() {
            const container = document.createElement("section");
            container.style.backgroundColor = 'white';
            container.style.position = 'sticky';
            container.style.bottom = '0';
            container.style.width = '80%';
            container.style.margin = 'auto';
            container.style.height = '5rem';
            return container;
          }

          function removePlaceholderContainer() {
            const container = document.getElementsByClassName('automation-content');
            container.item(0)?.remove();
          }
        },
        args: []
      });
    });
  }
}
