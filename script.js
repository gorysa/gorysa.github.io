const STORAGE_KEY = 'memo-app-items';

const memoInput = document.getElementById('memo-input');
const addButton = document.getElementById('add-button');
const clearButton = document.getElementById('clear-button');
const memoList = document.getElementById('memo-list');
const emptyMessage = document.getElementById('empty-message');
const template = document.getElementById('memo-item-template');

let memos = loadMemos();

function loadMemos() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : [];
  } catch (_error) {
    return [];
  }
}

function saveMemos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
}

function updateEmptyState() {
  emptyMessage.hidden = memos.length > 0;
}

function renderMemos() {
  memoList.innerHTML = '';

  memos.forEach((memo) => {
    const clone = template.content.cloneNode(true);
    const item = clone.querySelector('.memo-item');
    const textInput = clone.querySelector('.memo-text');
    const saveBtn = clone.querySelector('.save-button');
    const deleteBtn = clone.querySelector('.delete-button');

    textInput.value = memo.text;

    saveBtn.addEventListener('click', () => {
      const nextValue = textInput.value.trim();
      if (!nextValue) return;
      memo.text = nextValue;
      saveMemos();
    });

    textInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        saveBtn.click();
      }
    });

    deleteBtn.addEventListener('click', () => {
      memos = memos.filter((entry) => entry.id !== memo.id);
      saveMemos();
      renderMemos();
    });

    memoList.appendChild(item);
  });

  updateEmptyState();
}

function addMemo() {
  const text = memoInput.value.trim();
  if (!text) return;

  memos.unshift({ id: crypto.randomUUID(), text });
  memoInput.value = '';
  saveMemos();
  renderMemos();
}

addButton.addEventListener('click', addMemo);
memoInput.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    addMemo();
  }
});

clearButton.addEventListener('click', () => {
  if (memos.length === 0) return;
  memos = [];
  saveMemos();
  renderMemos();
});

renderMemos();
