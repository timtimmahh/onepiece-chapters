import Vue from 'vue'
export function setChapter (state, item) {
  if (item.index !== -1) {
    state.chapters[item.index] = item.item;
  } else {
    state.chapters.push(item.item);
  }
}

export function setChapters (state, items) {
  Vue.set(state, 'chapters', items);
}

export function setPage (state, item) {
  state.pages[item.id] = item;
  /* const index = state.pages.findIndex(page => page.id === item.id)
  if (index !== -1) {
    state.pages[index] = item;
  } else {
    state.pages.push(item);
  } */
}

export function setPages(state, items) {
  Vue.set(state, "pages", items);
}

export function setMediaItem (state, item) {
  state.media[m_item.id] = item;
  /* const index = state.media.findIndex(m_item => m_item.id === item.id);
  if (index !== -1) {
    state.media[index] = item;
  } else {
    state.media.push(item);
  } */
}

export function setMedia(state, items) {
  Vue.set(state, "media", items);
}
