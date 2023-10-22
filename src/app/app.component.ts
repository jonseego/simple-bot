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
                element.className = "bot-selected";
                if (botData.selectedIndeces.length === 2) {
                  for (let index = 0; index < children.length; index++) {
                    if (!botData.selectedIndeces.includes(index)) {
                      botData.predictedIndeces.push(index);
                    }
                  }
                  botData.predictedIndeces.forEach(predictedIndex => {
                    const element = children.item(predictedIndex) as HTMLElement;
                    element.className = "bot-predicted";
                  });
                  updateBotBody({
                    text: `Great! You selected ${botData.selectedIndeces.length} elements, we predicted ${botData.predictedIndeces.length} additional elements. In total, ${botData.selectedIndeces.length + botData.predictedIndeces.length} are selected`
                  });
                }
              });
            }
          }

          function resetSelection(parentClass: string, childTag: string) {
            const botData = mapBotData[parentClass];
            botData.predictedIndeces = [];
            botData.selectedIndeces = [];
            updateBotBody({ text: 'Select an element' });
            const parentEl = document.getElementsByClassName(parentClass)?.item(0) as HTMLDivElement;
            const children = parentEl.getElementsByTagName(childTag);
            for (let index = 0; index < children.length; index++) {
              const element = children.item(index) as HTMLDivElement;
              element.className = "";
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
            return element;
          }

          function createBotHeader() {
            const element = document.createElement("div");
            element.id = "bot-header";
            element.textContent = 'Step 1. For loop';
            return element;
          }

          function updateBotHeader(text: string) {
            const element = document.getElementById("bot-header");
            if (element) {
              element.textContent = text;
            }
          }

          function createBotBody() {
            const element = document.createElement("div");
            element.id = "bot-body";
            element.textContent = 'Select an element';
            return element;
          }

          function updateBotBody(params: {
            text?: string,
            actions?: string[],
          }) {
            const element = document.getElementById("bot-body");
            if (element) {
              if (params.text !== undefined) {
                element.textContent = params.text;
              }
              if (params.actions) {
                for (let index = 0; index < params.actions.length; index++) {
                  const action = params.actions[index];
                  const actionEl = document.createElement('div');
                  actionEl.className = "bot-action-card";
                  actionEl.textContent = action;
                  actionEl.addEventListener('click', () => {
                    actionEl.className = "bot-action-card selected";
                  });
                  element.appendChild(actionEl);
                }
              }
            }
          }

          function createBotFooter() {
            const container = document.createElement("div");
            container.id = "bot-footer";
            const resetButton = document.createElement("button");
            resetButton.textContent = 'Reset';
            resetButton.className = 'bot-button';
            resetButton.addEventListener('click', () => {
              resetSelection('todo-wrapper', 'form');
              resetSelection('todo-list', 'li');
            });
            const saveButton = document.createElement("button");
            saveButton.textContent = 'Save';
            saveButton.className = 'bot-button';
            saveButton.addEventListener('click', () => {
              updateBotHeader('Step 2. Choose a child action to execute');
              updateBotBody({
                text: '',
                actions: ['Click a button', 'Input text']
              });
              removeBotFooterActions();
              addBotFooterRunBotAction();
            });
            container.appendChild(resetButton);
            container.appendChild(saveButton);
            return container;
          }

          function removeBotFooterActions() {
            const element = document.getElementById("bot-footer");
            if (element) {
              const existingButtons = element.childNodes;
              const existingButtonLength = existingButtons.length;
              for (let index = 0; index < existingButtonLength; index++) {
                element.removeChild(existingButtons.item(0));
              }
            }
          }

          function addBotFooterRunBotAction() {
            const element = document.getElementById("bot-footer");
            if (element) {
              const runBotButton = document.createElement("button");
              runBotButton.textContent = 'Run Bot';
              runBotButton.className = 'bot-button';
              runBotButton.addEventListener('click', () => {
                //111 next
              });
              element.appendChild(runBotButton);
            }
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
      .bot-selected {
        border: 2px solid blue;
      }
      .bot-predicted {
        border: 2px solid green;
      }
      .bot-button {
        cursor: pointer;
        padding: 0.2rem 0.5rem;
      }
      .bot-action-card {
        padding: 0.5rem;
        border: 1px solid grey;
        border-radius: 0.5rem;
        cursor: pointer;
      }
      .bot-action-card.selected {
        border: 2px solid blue;
      }
      #bot-main-container {
        background-color: white;
        position: sticky;
        bottom: 0;
        width: 80%;
        margin: auto;
        height: 8rem;
        padding: 1rem;
        display: flex;
        flex-direction: column;
      }
      #bot-header {
        height: 2rem;
        font-weight: 600;
      }
      #bot-body {
        flex-grow: 1;
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      #bot-footer {
        height: 2rem;
        display: flex;
        align-items: end;
        justify-content: end;
        gap: 0.5rem;
      }
    }`;
  }
}
