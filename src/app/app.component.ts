import { Component, OnInit } from '@angular/core';
import { BotData } from './models';

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
          const mapBotData: {[key: string]: BotData} = {};

          removePlaceholderContainer();
          addActionBar();
          setupBot('todo-wrapper', 'form');
          setupBot('todo-list', 'li');

          function setupBot(parentClass: string, childTag: string) {
            const botData: BotData = {predictedIndeces: [], selectedIndeces: []};
            mapBotData[parentClass] = botData;
            const parentEl = document.getElementsByClassName(parentClass)?.item(0) as HTMLDivElement;
            const children = parentEl.getElementsByTagName(childTag);
            for (let index = 0; index < children.length; index++) {
              const element = children.item(index) as HTMLDivElement;
              element?.addEventListener("click", () => {
                botData.selectedIndeces.push(index);
                element.style.border = "2px solid blue";
                if (botData.selectedIndeces.length === 2) {
                  for (let index = 0; index < children.length; index++) {
                    if (!botData.selectedIndeces.includes(index)) {
                      botData.predictedIndeces.push(index);
                    }
                    botData.predictedIndeces.forEach(predictedIndex => {
                      const element = children.item(predictedIndex) as HTMLElement;
                      element.style.border = "2px dashed green";
                    });
                  }
                }
              });
            }
          }

          function resetSelection(parentClass: string, childTag: string) {
            const botData = mapBotData[parentClass];
            botData.predictedIndeces = [];
            botData.selectedIndeces = [];
            const parentEl = document.getElementsByClassName(parentClass)?.item(0) as HTMLDivElement;
            const children = parentEl.getElementsByTagName(childTag);
            for (let index = 0; index < children.length; index++) {
              const element = children.item(index) as HTMLDivElement;
              element.style.border = "";
            }
          }  

          function addActionBar() {
            const fragment = document.createDocumentFragment();
            const botContainer = fragment.appendChild(createMainContainer())
            botContainer.appendChild(createBotHeader());
            botContainer.appendChild(createBotBody());
            botContainer.appendChild(createBotFooter());
            document.body.appendChild(fragment);
          }

          function createMainContainer() {
            const container = document.createElement("section");
            container.id = "bot-main-container";
            container.style.backgroundColor = 'white';
            container.style.position = 'sticky';
            container.style.bottom = '0';
            container.style.width = '80%';
            container.style.margin = 'auto';
            container.style.height = '8rem';
            container.style.padding = '1rem';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            return container;
          }

          function createBotHeader() {
            const container = document.createElement("div");
            container.id = "bot-header";
            container.style.height = '2rem';
            container.textContent = "Step 1. For loop";
            return container;
          }

          function createBotBody() {
            const container = document.createElement("div");
            container.id = "bot-body";
            container.style.flexGrow = '1';
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.textContent = "Select an element";
            return container;
          }

          function createBotFooter() {
            const container = document.createElement("div");
            container.id = "bot-footer";
            container.style.height = '2rem';
            container.style.display = 'flex';
            container.style.alignItems = 'end';
            container.style.justifyContent = 'end';
            container.style.gap = '0.5rem';
            const resetButton = document.createElement("button");
            resetButton.textContent = 'Reset';
            resetButton.addEventListener('click', () => {
              resetSelection('todo-wrapper', 'form');
              resetSelection('todo-list', 'li');
            });
            const saveButton = document.createElement("button");
            saveButton.textContent = 'Save';
            container.appendChild(resetButton);
            container.appendChild(saveButton);
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
        border: 2px dashed blue;
        cursor: pointer;
      }
      .todo-wrapper > form:hover {
        border: 2px dashed blue;
        cursor: pointer;
      }
    }`;
  }
}
