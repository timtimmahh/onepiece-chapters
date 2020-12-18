import axios from "axios";

const needsUpdate = (state, data) => state[data].length === 0;

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
  if (!needsUpdate(state, "pages")) {
    return;
  }
  axios.get("https://onepiecechapters.com/wp-json/wp/v2/pages").then(pages =>
    commit(
      "setPages",
      pages.data.map(function(item) {
        return {
          id: item.id,
          title: item.title.rendered,
          content: item.content.rendered,
          page: "/" + item.slug
        };
      })
    )
  );
}


const parseChapter = content => {
  return [
    ...content.replaceAll(/[\n\t]/g, "").matchAll(/src="([\w:/.%-]+\.png)">/g)
  ].map(match => match[1]);
};

export function updateChapter ({ commit, state }, id) {
  axios
    .get("https://onepiecechapters.com/wp-json/wp/v2/posts/" + id)
    .then(item =>
      commit("setChapter", {
        id: item.id,
        title: item.title.rendered.replace("One Piece – ", ""),
        to: item.id,
        content: parseChapter(item.content.rendered)
      })
    );
}

export function updateChapters({ commit, state }) {
  if (!needsUpdate(state, "chapters")) {
    return;
  }
  axios
    .get("https://onepiecechapters.com/wp-json/wp/v2/posts?per_page=100")
    .then(posts =>
      commit(
        "setChapters",
        posts.data.map(item => ({
          id: item.id,
          title: item.title.rendered.replace("One Piece – ", ""),
          to: item.id,
          content: parseChapter(item.content.rendered)
        }))
      )
    );
}

export function updateMediaItem ({ commit, state }, id) {
  axios.get("https://onepiecechapters.com/wp-json/wp/v2/media" + id)
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
  if (!needsUpdate(state, "media")) {
    return;
  }
  axios.get("https://onepiecechapters.com/wp-json/wp/v2/media").then(media =>
    commit(
      "setMedia",
      media.data.map(function(item) {
        return {
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
      })
    )
  );
}
