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
          let botBody: HTMLDivElement;

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
                  }
                  botData.predictedIndeces.forEach(predictedIndex => {
                    const element = children.item(predictedIndex) as HTMLElement;
                    element.style.border = "2px solid green";
                  });
                  updateBotBody(`Great! You selected ${botData.selectedIndeces.length} elements, we predicted ${botData.predictedIndeces.length} additional elements. In total, ${botData.selectedIndeces.length + botData.predictedIndeces.length} are selected`);
                }
              });
            }
          }

          function resetSelection(parentClass: string, childTag: string) {
            const botData = mapBotData[parentClass];
            botData.predictedIndeces = [];
            botData.selectedIndeces = [];
            updateBotBody('Select an element');
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
            const element = document.createElement("section");
            element.id = "bot-main-container";
            element.style.backgroundColor = 'white';
            element.style.position = 'sticky';
            element.style.bottom = '0';
            element.style.width = '80%';
            element.style.margin = 'auto';
            element.style.height = '8rem';
            element.style.padding = '1rem';
            element.style.display = 'flex';
            element.style.flexDirection = 'column';
            return element;
          }

          function createBotHeader() {
            const element = document.createElement("div");
            element.id = "bot-header";
            element.style.height = '2rem';
            element.textContent = 'Step 1. For loop';
            return element;
          }

          function createBotBody() {
            const element = document.createElement("div");
            element.id = "bot-body";
            element.style.flexGrow = '1';
            element.style.display = 'flex';
            element.style.alignItems = 'center';
            element.textContent = 'Select an element';
            return element;
          }

          function updateBotBody(text: string) {
            const element = document.getElementById("bot-body");
            if (element) {
              element.textContent = text;
            }
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
