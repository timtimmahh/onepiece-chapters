import axios from "axios";
import { date } from 'quasar'

function needsUpdate(data, minLength=0) {
  return data.length <= minLength;
}

export function updatePage ({ commit, state }, pageId) {
  axios.get("https://onepiecechapters.com/wp-json/wp/v2/pages/" + pageId)
    .then(item =>
      commit('setPage', {
          id: item.id,
          title: item.title.rendered,
          content: item.content.rendered,
          page: "/" + item.slug
        }));
}

export function updatePages({ commit, state }) {
  if (!needsUpdate(state.pages)) {
    return;
  }
  axios.get("https://onepiecechapters.com/wp-json/wp/v2/pages").then(pages =>
    commit(
      "setPages",
      pages.data.reduce(function (result, item) {
        result[item.slug] = {
          id: item.id,
          title: item.title.rendered,
          content: item.content.rendered,
          page: "/" + item.slug
        };
        return result;
      }, { length: pages.data.length })
      /* pages.data.map(function(item) {
        return {
          id: item.id,
          title: item.title.rendered,
          content: item.content.rendered,
          page: "/" + item.slug
        };
      }) */
    )
  );
}


const parseChapter = (content, excerpt) => {
  content = content.replaceAll(/[\n\t]/g, "");
  excerpt = excerpt.replaceAll(/[\n\t]|<[\w/!-\s]+>|\s+=+>[\w\s]+/g, "");
  return {
    excerpt: excerpt,
    upcomingDate: excerpt.toLowerCase().includes("upcoming")
      ? date.extractDate(
        [...content.matchAll(/iframe src="[\w:/.%-]+\/[a-zA-Z]+([\w:-]+)"/g)][0][1],
        'YYYY-MM-DDTHH:mm:ss'
      ) : undefined,
    content: [...content.matchAll(/src="([\w:/.%-]+\.png)">/g)].map(
      match => match[1]
    )
  };
};

export function updateChapter ({ commit, state }, id) {
  const index = state.chapters.findIndex(chapter => chapter.id === item.id);
  if (index != -1 && !needsUpdate(state.chapters[id].content, 1)) {
    return;
  }
  axios
    .get("https://onepiecechapters.com/wp-json/wp/v2/posts/" + id)
    .then(item => {
      const chapter = parseChapter(item.content.rendered, item.excerpt.rendered);
      commit("setChapter", {
        index: index,
        item: {
          id: item.id,
          title: item.title.rendered.replace("One Piece – ", ""),
          to: item.id,
          excerpt: chapter.excerpt,
          content: chapter.content,
          upcomingDate: chapter.upcomingDate
        }
      });
    });
}

export function updateChapters ({ commit, state }) {
  if (!needsUpdate(state.chapters)) {
    return;
  }
  axios
    .get("https://onepiecechapters.com/wp-json/wp/v2/posts?per_page=100")
    .then(posts =>
      commit(
        "setChapters",
        posts.data.map(item => {
          const chapter = parseChapter(
            item.content.rendered,
            item.excerpt.rendered
          );
          return {
            id: item.id,
            title: item.title.rendered.replace("One Piece – ", ""),
            to: item.id,
            excerpt: chapter.excerpt,
            content: chapter.content,
            upcomingDate: chapter.upcomingDate
          };
      })
      )
    );
}

export function updateMediaItem ({ commit, state }, id) {
  axios.get("https://onepiecechapters.com/wp-json/wp/v2/media/" + id)
    .then(media =>
      commit(
        "setMediaItem", {
        id: item.id,
        slug: item.slug,
        title: item.title.rendered,
        default: {
          width: item.media_details.width,
          height: item.media_details.height,
          file: item.media_details.file,
          src: item.source_url
        },
        sizes: item.media_details.sizes
      })
  );
}

export function updateMedia({ commit, state }) {
  if (!needsUpdate(state.media)) {
    return;
  }
  axios.get("https://onepiecechapters.com/wp-json/wp/v2/media").then(media =>
    commit(
      "setMedia",
      media.data.reduce(function (result, item) {
        result[item.id] = {
            id: item.id,
            slug: item.slug,
            title: item.title.rendered,
            default: {
              width: item.media_details.width,
              height: item.media_details.height,
              file: item.media_details.file,
              src: item.source_url
            },
            sizes: item.media_details.sizes
        };
        return result;
      }, { length: media.data.length })
    )
  );
}
