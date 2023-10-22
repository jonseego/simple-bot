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
          let selectedNodes: HTMLDivElement[] = [];

          removePlaceholderContainer();
          addActionBar();
          addClickListeners();

          function addClickListeners() {
            const parentEl = document.getElementsByClassName('todo-wrapper')?.item(0) as HTMLDivElement;
            const children = parentEl.getElementsByTagName('form');
            for (let index = 0; index < children.length; index++) {
              const element = children.item(index);
              element?.addEventListener("click", () => {
                selectedNodes.push(element as any);
                processNodes(selectedNodes);
              });
            }
  
            const parentEl2 = document.getElementsByClassName('todo-list').item(0) as HTMLDivElement;
            parentEl2.childNodes.forEach((_listItem) => {
              const listItem = _listItem as HTMLDivElement;
              listItem.addEventListener("click", () => {
                selectedNodes.push(listItem);
                processNodes(selectedNodes);
              });
            });
          }

          function processNodes(nodes: HTMLDivElement[]) {
            nodes.forEach((node) => {
              node.style.border = "2px solid blue";
            });
          }

          function addActionBar() {
            const fragment = document.createDocumentFragment();
            const header = fragment.appendChild(createMainContainer())
            header.textContent = "Step 1. For loop";
  
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
      chrome.scripting
      .insertCSS({
        target: { tabId: tabs[0].id! },
        css : this.getGlobalCss(),
      })
    });
  }

  private getGlobalCss(): string {
    return `body {
      .todo-list > li:hover {
        border: 2px solid blue;
      }
      .todo-wrapper > form:hover {
        border: 2px solid blue;
      }
    }`;
  }
}
