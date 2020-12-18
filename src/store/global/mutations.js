import Vue from 'vue'
export function setChapter (state, item) {
  const index = state.chapters.findIndex(chapter => chapter.id === item.id);
  if (index !== -1) {
    state.chapters[index] = item;
  } else {
    state.chapters.push(item);
  }
}

export function setChapters (state, items) {
  Vue.set(state, 'chapters', items);
}

export function setPage (state, item) {
  const index = state.pages.findIndex(page => page.id === item.id)
  if (index !== -1) {
    state.pages[index] = item;
  } else {
    state.pages.push(item);
  }
}

export function setPages(state, items) {
  Vue.set(state, "pages", items);
}

export function setMediaItem(state, item) {
  const index = state.media.findIndex(m_item => m_item.id === item.id);
  if (index !== -1) {
    state.media[index] = item;
  } else {
    state.media.push(item);
  }
}

export function setMedia(state, items) {
  Vue.set(state, "media", items);
}
