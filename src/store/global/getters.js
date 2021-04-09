export function getChapterContent (state) {
  return (id) => {
    let chapter = state.chapters.find(
      (chapter) => chapter.to == id
    )
    return chapter ? chapter.content : [];
  }
}

export function getChapterTitle (state) {
  return (id) => {
    let chapter = state.chapters.find(
      (chapter) => chapter.to == id
    )
    return chapter ? chapter.title : '';
  }
}

export function getUpcomingDate(state) {
  return id => {
    let chapter = state.chapters.find(chapter => chapter.to == id);
    return chapter.upcomingDate
  };
}
