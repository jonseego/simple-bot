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
          setupBot('todo-wrapper', 'form');
          setupBot('todo-list', 'li');

          function setupBot(parentClass: string, childTag: string) {
            const parentEl = document.getElementsByClassName(parentClass)?.item(0) as HTMLDivElement;
            const children = parentEl.getElementsByTagName(childTag);
            const selectedIndeces: number[] = [];
            const predictedIndeces: number[] = [];
            for (let index = 0; index < children.length; index++) {
              const element = children.item(index) as HTMLDivElement;
              element?.addEventListener("click", () => {
                selectedIndeces.push(index);
                element.style.border = "2px solid blue";
                if (selectedIndeces.length === 2) {
                  for (let index = 0; index < children.length; index++) {
                    if (!selectedIndeces.includes(index)) {
                      predictedIndeces.push(index);
                    }
                    predictedIndeces.forEach(predictedIndex => {
                      const element = children.item(predictedIndex) as HTMLElement;
                      element.style.border = "2px solid green";
                    });
                  }
                }
              });
            }
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
